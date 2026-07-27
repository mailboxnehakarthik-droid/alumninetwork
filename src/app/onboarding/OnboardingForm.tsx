"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRANCHES } from "@/lib/constants";
import type { Profile, UserType } from "@/lib/types";

const FIELD =
  "w-full rounded-sm border border-gold/40 bg-ivory-dim/40 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const LABEL =
  "font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60";

export default function OnboardingForm({
  userId,
  initial,
  initialPersonalEmail = "",
  email,
  redirectTo = "/",
}: {
  userId: string;
  initial: Profile | null;
  initialPersonalEmail?: string;
  email: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const isCollegeEmail = email.trim().toLowerCase().endsWith("@bmsce.ac.in");

  const [userType, setUserType] = useState<UserType>(
    isCollegeEmail ? "student" : initial?.user_type ?? "alumni"
  );
  const [personalEmail, setPersonalEmail] = useState(initialPersonalEmail);
  const [done, setDone] = useState(false);
  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [city, setCity] = useState(initial?.current_city ?? "");
  const [gradYear, setGradYear] = useState(
    initial?.graduation_year ? String(initial.graduation_year) : ""
  );
  const knownBranch =
    initial?.branch && (BRANCHES as readonly string[]).includes(initial.branch);
  const [branch, setBranch] = useState(
    knownBranch ? initial!.branch! : initial?.branch ? "Other" : ""
  );
  const [branchOther, setBranchOther] = useState(
    knownBranch ? "" : initial?.branch ?? ""
  );
  const [company, setCompany] = useState(initial?.company ?? "");
  const [jobTitle, setJobTitle] = useState(initial?.job_title ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [linkedin, setLinkedin] = useState(initial?.linkedin_url ?? "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photo_url ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const thisYear = new Date().getFullYear();
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Clear a single field's error as the user fixes it.
  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  // Errored inputs get a red border on top of the shared field style.
  const fieldClass = (key: string) =>
    errors[key] ? `${FIELD} border-oxblood/70` : FIELD;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (userType !== "alumni" && userType !== "student") {
      errs.userType = "Please select one.";
    }
    if (!fullName.trim()) errs.fullName = "This field is required.";
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      errs.email = "A valid email address is required.";
    }
    if (isCollegeEmail) {
      if (!personalEmail.trim()) errs.personalEmail = "This field is required.";
      else if (!EMAIL_RE.test(personalEmail.trim()))
        errs.personalEmail = "Enter a valid email address.";
    }
    if (!city.trim()) errs.city = "This field is required.";
    if (!gradYear.trim()) {
      errs.gradYear = "This field is required.";
    } else {
      const y = Number(gradYear);
      if (!Number.isInteger(y) || y < 1946 || y > thisYear + 6) {
        errs.gradYear = `Enter a year between 1946 and ${thisYear + 6}.`;
      }
    }
    if (!branch) errs.branch = "This field is required.";
    else if (branch === "Other" && !branchOther.trim())
      errs.branch = "Please enter your branch / degree.";
    return errs;
  };

  // Honour the "student" entry point chosen on the login screen.
  useEffect(() => {
    if (isCollegeEmail) return; // college-email users are always students
    try {
      const pending = window.localStorage.getItem("pending_user_type");
      if (pending === "student" || pending === "alumni") {
        setUserType(pending);
        window.localStorage.removeItem("pending_user_type");
      }
    } catch {
      // ignore
    }
  }, [isCollegeEmail]);

  const isStudent = userType === "student";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate before doing anything, so the button never "silently" no-ops.
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError(null);
      // Bring the first invalid field into view.
      setTimeout(() => {
        document
          .querySelector('[data-error="true"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let nextPhotoUrl = photoUrl;

      if (photoFile) {
        const ext = photoFile.name.split(".").pop() || "jpg";
        const path = `${userId}/avatar-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(path, photoFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);
        nextPhotoUrl = pub.publicUrl;
      }

      const resolvedBranch =
        branch === "Other" ? branchOther.trim() : branch || null;

      // Upsert (not update): the row may not exist yet if this account predates
      // the handle_new_user trigger. Insert-or-update keyed on the user id so
      // onboarding always completes. verification_status/role are intentionally
      // omitted — they're set by the signup trigger / admin, and the DB guard
      // blocks non-admins from changing them anyway.
      const { error: upsertErr } = await supabase.from("profiles").upsert(
        {
          id: userId,
          user_type: userType,
          full_name: fullName.trim() || null,
          current_city: city.trim() || null,
          graduation_year: gradYear ? Number(gradYear) : null,
          branch: resolvedBranch,
          company: isStudent ? null : company.trim() || null,
          job_title: isStudent ? null : jobTitle.trim() || null,
          bio: bio.trim() || null,
          linkedin_url: linkedin.trim() || null,
          photo_url: nextPhotoUrl || null,
          onboarded: true,
        },
        { onConflict: "id" }
      );

      if (upsertErr) throw upsertErr;

      // Personal email is sensitive — it lives in member_contacts, never on the
      // profile row. Only college-email students provide one here.
      if (isCollegeEmail && personalEmail.trim()) {
        // Non-fatal: the profile is already saved. If this fails (e.g. the
        // hardening migration hasn't run yet), don't block onboarding.
        await supabase
          .from("member_contacts")
          .upsert(
            { member_id: userId, personal_email: personalEmail.trim() },
            { onConflict: "member_id" }
          );
      }

      // College-email students: move their login to the personal email so they
      // keep access after graduation. Supabase emails a confirmation link to
      // the new address; their verified-student status stays on the same
      // account.
      if (isCollegeEmail && personalEmail.trim()) {
        const { error: emailErr } = await supabase.auth.updateUser({
          email: personalEmail.trim(),
        });
        if (emailErr) {
          // Non-fatal: profile is saved, they can retry the email switch later.
          setError(
            `Profile saved, but we couldn't send the confirmation to your personal email: ${emailErr.message}`
          );
        }
        setDone(true);
        setSaving(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save. Please try again."
      );
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-sm border border-gold/40 bg-ivory-dim/40 px-6 py-8 text-center">
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
          You&rsquo;re all set
        </span>
        <p className="mx-auto mt-4 max-w-md font-display text-2xl italic leading-snug text-oxblood">
          Verified as a BMS student.
        </p>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-ink/70">
          We&rsquo;ve sent a confirmation link to{" "}
          <span className="font-medium text-ink">{personalEmail}</span>. Click it
          to make that your sign-in email — until then you can keep using your
          college email. {error ? "" : ""}
        </p>
        {error && (
          <p className="mx-auto mt-4 max-w-md rounded-sm border border-oxblood/30 bg-oxblood/5 px-4 py-3 font-sans text-sm text-oxblood">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            router.push(redirectTo);
            router.refresh();
          }}
          className="mt-8 inline-flex items-center justify-center rounded-sm bg-oxblood px-8 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-maroon"
        >
          Continue to the network
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {/* Type toggle — hidden for college-email users (always verified students) */}
      {isCollegeEmail ? (
        <div className="rounded-sm border border-gold/40 bg-gold/10 px-5 py-4">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
            ✓ Verified student
          </span>
          <p className="mt-2 font-sans text-sm leading-relaxed text-ink/70">
            Your <span className="font-medium">{email}</span> address verifies
            you as a current BMS student. Add a personal email below so you keep
            access after you graduate — we&rsquo;ll use it for future sign-ins.
          </p>
        </div>
      ) : (
        <div data-error={errors.userType ? "true" : undefined}>
          <span className={LABEL}>
            I am a…<span className="text-oxblood"> *</span>
          </span>
          <div className="mt-3 inline-flex rounded-sm border border-gold/40 p-1">
            {(["alumni", "student"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setUserType(t);
                  clearError("userType");
                }}
                className={`rounded-[2px] px-5 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.12em] transition-colors ${
                  userType === t
                    ? "bg-oxblood text-ivory"
                    : "text-ink/70 hover:text-oxblood"
                }`}
              >
                {t === "alumni" ? "BMS Alumnus" : "Current student"}
              </button>
            ))}
          </div>
          {errors.userType && (
            <p className="mt-2 font-sans text-xs text-oxblood">
              {errors.userType}
            </p>
          )}
        </div>
      )}

      {isCollegeEmail && (
        <Field label="Personal email" required error={errors.personalEmail}>
          <input
            className={fieldClass("personalEmail")}
            type="email"
            value={personalEmail}
            onChange={(e) => {
              setPersonalEmail(e.target.value);
              clearError("personalEmail");
            }}
            placeholder="you@gmail.com"
          />
        </Field>
      )}

      {/* Photo */}
      <div className="flex items-center gap-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-ivory-dim">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-lg italic text-oxblood/60">
              {(fullName || "?").charAt(0)}
            </span>
          )}
        </div>
        <div>
          <label className={`${LABEL} block cursor-pointer`}>
            Profile photo
            <input
              type="file"
              accept="image/*"
              className="mt-2 block text-xs text-ink/60 file:mr-3 file:cursor-pointer file:rounded-sm file:border file:border-gold/40 file:bg-ivory-dim/60 file:px-3 file:py-1.5 file:font-sans file:text-[11px] file:uppercase file:tracking-[0.12em] file:text-ink"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setPhotoFile(f);
                if (f) setPhotoUrl(URL.createObjectURL(f));
              }}
            />
          </label>
        </div>
      </div>

      <Field label="Full name" required error={errors.fullName}>
        <input
          className={fieldClass("fullName")}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            clearError("fullName");
          }}
          placeholder="Your name"
        />
      </Field>

      <Field label="Email" required error={errors.email}>
        <input className={`${FIELD} opacity-60`} value={email} disabled />
      </Field>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Field label="Current city" required error={errors.city}>
          <input
            className={fieldClass("city")}
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              clearError("city");
            }}
            placeholder="Bengaluru"
          />
        </Field>
        <Field
          label={isStudent ? "Expected year of graduation" : "Year of graduation"}
          required
          error={errors.gradYear}
        >
          <input
            className={fieldClass("gradYear")}
            type="number"
            min={1946}
            max={thisYear + 6}
            value={gradYear}
            onChange={(e) => {
              setGradYear(e.target.value);
              clearError("gradYear");
            }}
            placeholder={String(isStudent ? thisYear + 2 : thisYear - 5)}
          />
        </Field>
      </div>

      <Field label="Branch / degree" required error={errors.branch}>
        <select
          className={fieldClass("branch")}
          value={branch}
          onChange={(e) => {
            setBranch(e.target.value);
            clearError("branch");
          }}
        >
          <option value="">Select a branch…</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        {branch === "Other" && (
          <input
            className={`${fieldClass("branch")} mt-3`}
            value={branchOther}
            onChange={(e) => {
              setBranchOther(e.target.value);
              clearError("branch");
            }}
            placeholder="Your branch / degree"
          />
        )}
      </Field>

      {!isStudent && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Field label="Current company">
            <input
              className={FIELD}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company"
            />
          </Field>
          <Field label="Role / title">
            <input
              className={FIELD}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Software Engineer"
            />
          </Field>
        </div>
      )}

      <Field label={isStudent ? "What are you looking for?" : "Short bio"}>
        <textarea
          className={`${FIELD} min-h-[110px] resize-y`}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={
            isStudent
              ? "The kind of guidance or field you're hoping to explore…"
              : "A line or two about you and your work."
          }
        />
      </Field>

      <Field label="LinkedIn URL">
        <input
          className={FIELD}
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="https://linkedin.com/in/you"
        />
      </Field>

      {error && (
        <p className="rounded-sm border border-oxblood/30 bg-oxblood/5 px-4 py-3 font-sans text-sm text-oxblood">
          {error}
        </p>
      )}

      {Object.keys(errors).length > 0 && (
        <p
          role="alert"
          className="rounded-sm border border-oxblood/30 bg-oxblood/5 px-4 py-3 font-sans text-sm text-oxblood"
        >
          Please fill in the required fields marked above before continuing.
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-sm bg-oxblood px-8 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-maroon disabled:opacity-60"
        >
          {saving ? "Saving…" : "Finish"}
        </button>
        {!isStudent && (
          <p className="font-sans text-xs text-ink/50">
            You&rsquo;ll be reviewed before appearing in the directory.
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" data-error={error ? "true" : undefined}>
      <span className={LABEL}>
        {label}
        {required && <span className="text-oxblood"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
      {error && (
        <p className="mt-1.5 font-sans text-xs text-oxblood">{error}</p>
      )}
    </label>
  );
}

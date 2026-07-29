import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy — BMSCE Alumni Network",
  description:
    "How the BMSCE Alumni Network collects, uses, shares, and retains your information — and the choices you have over your data.",
};

const HEADING = "mt-12 font-display text-2xl text-ink md:text-3xl";
const BODY = "mt-4 font-sans text-base leading-relaxed text-ink/70";
const LIST =
  "mt-4 flex flex-col gap-3 font-sans text-base leading-relaxed text-ink/70";

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-2.5 h-px w-3 shrink-0 bg-gold"
      />
      <span>{children}</span>
    </li>
  );
}

const EMAIL = "bmscealumni@bmsce.ac.in";

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto max-w-3xl px-6 pb-24 pt-20 md:px-10 md:pt-28">
            <Reveal>
              <Eyebrow>Privacy</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.03] tracking-tight text-ink">
                Privacy Policy
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/45">
                Last updated: July 29, 2026
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 border-t border-gold/30 pt-10">
                <p className={BODY.replace("mt-4", "")}>
                  BMSCE Alumni Network (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
                  &ldquo;our&rdquo;) operates this website to connect alumni of
                  BMS College of Engineering with each other, current students,
                  and the wider alumni community. This policy explains what
                  information we collect, why, and how it&rsquo;s handled.
                </p>

                <h2 className={HEADING}>Information We Collect</h2>
                <p className={BODY}>
                  When you create an account or use this site, we may collect:
                </p>
                <ul className={LIST}>
                  <Bullet>
                    <span className="font-medium text-ink">
                      Account information:
                    </span>{" "}
                    your name, email address, and profile photo (from Google or
                    LinkedIn sign-in, or provided directly)
                  </Bullet>
                  <Bullet>
                    <span className="font-medium text-ink">
                      Profile details:
                    </span>{" "}
                    current city, year of graduation, branch/degree, current
                    company and job title, a short bio, and your LinkedIn
                    profile URL
                  </Bullet>
                  <Bullet>
                    <span className="font-medium text-ink">
                      Mentorship activity:
                    </span>{" "}
                    whether you&rsquo;ve opted in as a mentor or mentee, your
                    areas of expertise or interests, and messages exchanged
                    through mentorship requests
                  </Bullet>
                  <Bullet>
                    <span className="font-medium text-ink">
                      Career activity:
                    </span>{" "}
                    job/internship postings and applications, including uploaded
                    resumes and phone numbers where provided
                  </Bullet>
                  <Bullet>
                    <span className="font-medium text-ink">
                      Usage information:
                    </span>{" "}
                    basic activity on the site, such as event RSVPs
                  </Bullet>
                </ul>

                <h2 className={HEADING}>How We Use This Information</h2>
                <p className={BODY}>We use the information above to:</p>
                <ul className={LIST}>
                  <Bullet>
                    Verify that you are a genuine BMS alumnus or current student
                    before granting access to the directory and other member
                    features
                  </Bullet>
                  <Bullet>
                    Display your profile to other verified members in the
                    Directory (only after admin verification)
                  </Bullet>
                  <Bullet>
                    Facilitate mentorship matching and job/internship
                    applications between alumni and students
                  </Bullet>
                  <Bullet>
                    Share relevant events, newsletters, and community updates
                  </Bullet>
                  <Bullet>
                    Maintain the security and integrity of the platform
                  </Bullet>
                </ul>

                <h2 className={HEADING}>How We Share Information</h2>
                <p className={BODY}>
                  We do not sell your personal information. Your profile is
                  visible only to other verified, signed-in members of the
                  network — not to the public or third parties — unless you
                  choose to make specific information public (e.g., in the
                  Directory).
                </p>
                <p className={BODY}>
                  We use Supabase to host our database and manage authentication;
                  Google and LinkedIn are used solely as sign-in providers and
                  only receive the standard information required to authenticate
                  you (typically your name, email, and profile photo).
                </p>

                <h2 className={HEADING}>Your Choices</h2>
                <p className={BODY}>
                  You can update or correct your profile information at any time
                  by signing in and editing your profile. You can request
                  deletion of your account and associated data from your profile
                  settings, or by contacting us at the email below.
                </p>

                <h2 className={HEADING}>Data Retention</h2>
                <p className={BODY}>
                  We retain your information for as long as your account is
                  active. If you delete your account, we will remove your
                  personal data within a reasonable time, except where retention
                  is required for legal or security reasons.
                </p>

                <h2 className={HEADING}>Contact</h2>
                <p className={BODY}>
                  If you have questions about this policy or your data, contact
                  us at:{" "}
                  <a
                    href={`mailto:${EMAIL}?subject=Privacy%20enquiry`}
                    className="text-oxblood underline decoration-accent underline-offset-4 transition-colors hover:text-maroon"
                  >
                    {EMAIL}
                  </a>
                </p>
                <p className="mt-8 border-t border-gold/25 pt-8 font-sans text-sm leading-relaxed text-ink/55">
                  This policy may be updated from time to time. Continued use of
                  the site after changes constitutes acceptance of the updated
                  policy.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

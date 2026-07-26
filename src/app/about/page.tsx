import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import FounderWidget from "@/components/FounderWidget";

export const metadata: Metadata = {
  title: "About — BMSCE Alumni Network",
  description:
    "About BMS College of Engineering, our founder B. M. Sreenivasaiah, and how to reach the alumni network.",
};

// Drop the founder's portrait in at public/founder.jpg and it replaces the
// placeholder automatically — no code change needed.
const FOUNDER_PHOTO_FILE = "founder.jpg";

function founderPhotoUrl(): string | null {
  try {
    const p = path.join(process.cwd(), "public", FOUNDER_PHOTO_FILE);
    return fs.existsSync(p) ? `/${FOUNDER_PHOTO_FILE}` : null;
  } catch {
    return null;
  }
}

export default function AboutPage() {
  const photoUrl = founderPhotoUrl();

  return (
    <>
      <Nav />
      <main>
        {/* 1 — Founder widget (maroon / oxblood, top of page) */}
        <FounderWidget
          photoUrl={photoUrl}
          photoFileName={`/public/${FOUNDER_PHOTO_FILE}`}
        />

        {/* 2 — About the college */}
        <section className="border-t border-gold/30">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <Reveal>
              <Eyebrow>The college</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-2xl font-display text-4xl leading-[1.05] text-ink md:text-5xl">
                About BMS College of Engineering
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-3xl font-sans text-base leading-relaxed text-ink/70 md:text-lg">
                BMS College of Engineering (BMSCE) is a private engineering
                college in Basavanagudi, Bangalore, run by the B.M.S.
                Educational Trust. Affiliated with Visvesvaraya Technological
                University, the college became autonomous in 2008 and has since
                been recognized with an A++ NAAC grade and Tier I NBA
                accreditation — among the first institutions in Karnataka to
                achieve this. BMSCE offers a wide range of undergraduate and
                postgraduate programs across engineering and management, with
                several departments recognized as research centers. Today, the
                college&rsquo;s alumni network spans over 24,000 members
                worldwide.
              </p>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 border-l border-t border-gold/30 sm:grid-cols-3">
              {[
                { stat: "1946", label: "Founded" },
                { stat: "A++", label: "NAAC grade" },
                { stat: "24,000+", label: "Alumni worldwide" },
              ].map((item, i) => (
                <Reveal
                  key={item.label}
                  delay={i * 90}
                  className="border-b border-r border-gold/30"
                >
                  <div className="px-6 py-8 md:py-10">
                    <p className="font-display text-4xl text-oxblood">
                      {item.stat}
                    </p>
                    <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                      {item.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3 — Contact */}
        <section id="contact" className="border-t border-gold/30">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <Reveal>
                  <Eyebrow>Get in touch</Eyebrow>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="mt-6 max-w-md font-display text-4xl leading-[1.05] text-ink md:text-5xl">
                    Contact Us
                  </h2>
                </Reveal>
                <Reveal delay={160}>
                  <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-ink/70">
                    Questions about the network, your membership, or an event?
                    We&rsquo;d love to hear from you.
                  </p>
                </Reveal>
              </div>

              <Reveal delay={160}>
                <div className="border border-gold/30 bg-ivory-dim/50 p-8 md:p-10">
                  <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                    BMS College of Engineering
                  </h3>
                  <address className="mt-4 not-italic font-sans text-base leading-relaxed text-ink/75">
                    P.O. Box No.: 1908, Bull Temple Road,
                    <br />
                    Bangalore - 560 019,
                    <br />
                    Karnataka, India
                  </address>

                  <dl className="mt-8 flex flex-col gap-5 border-t border-gold/25 pt-8">
                    <div>
                      <dt className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">
                        Email
                      </dt>
                      <dd className="mt-1.5">
                        <a
                          href="mailto:bmscealumni@bmsce.ac.in"
                          className="font-sans text-base text-oxblood underline decoration-gold underline-offset-4 transition-colors hover:text-maroon"
                        >
                          bmscealumni@bmsce.ac.in
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">
                        Phone
                      </dt>
                      <dd className="mt-1.5">
                        <a
                          href="tel:+918660230306"
                          className="font-sans text-base text-oxblood underline decoration-gold underline-offset-4 transition-colors hover:text-maroon"
                        >
                          +91 86602 30306
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password — BMS Alumni Network",
};

export default function ResetPasswordPage() {
  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto max-w-md px-6 pb-24 pt-20 md:pt-28">
            <Eyebrow>Account</Eyebrow>
            <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-tight text-ink">
              Set a new password.
            </h1>
            <p className="mt-5 font-sans text-base leading-relaxed text-ink/70">
              Choose a new password for your account.
            </p>
            <div className="mt-10">
              <ResetPasswordForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

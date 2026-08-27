import type { Metadata } from "next";
import { headers } from "next/headers";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Set NEXT_PUBLIC_SITE_URL to your production domain so shared-link previews
// and the sitemap use absolute URLs. Falls back to localhost for dev.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BMSCE Alumni Network — Once BMS. Always BMS.",
    template: "%s",
  },
  description:
    "The home for every BMS graduate — find your batch, your city chapter, a mentor, or your next opportunity.",
  openGraph: {
    title: "BMSCE Alumni Network — Once BMS. Always BMS.",
    description:
      "The home for every BMS graduate — find your batch, your city chapter, a mentor, or your next opportunity.",
    siteName: "BMSCE Alumni Network",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMSCE Alumni Network — Once BMS. Always BMS.",
    description:
      "The home for every BMS graduate — find your batch, your city chapter, a mentor, or your next opportunity.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Next.js applies this nonce automatically to its own framework-injected
  // scripts by parsing it back out of the Content-Security-Policy response
  // header set in middleware — no manual <script nonce> needed for those.
  // Reading it here (a) makes it available via headers() for any future
  // inline/third-party <Script nonce={nonce}> this layout adds, and (b)
  // forces every route through this layout into dynamic rendering, which
  // nonce-based CSP requires (a nonce can't be baked into a statically
  // pre-rendered page at build time — see Next's CSP guide).
  const nonce = (await headers()).get("x-nonce");
  void nonce;

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

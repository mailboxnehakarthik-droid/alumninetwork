import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Public, indexable pages only. Auth-gated pages (directory profiles, job
// openings, admin, profile, onboarding) are intentionally excluded.
const ROUTES = [
  "",
  "/about",
  "/events",
  "/chapters",
  "/notable-alumni",
  "/newsletter",
  "/careers/jobs",
  "/careers/internships",
  "/careers/mentorship",
  "/faqs",
  "/give-back",
  "/leadership",
  "/press",
  "/login",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}

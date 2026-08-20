// Common BMSCE branches/degrees for the profile dropdown. Sorted alphabetically
// here at the source so both onboarding and profile-edit (which share this
// constant) stay in sync. "Other" is the catch-all and stays pinned last.
const BRANCH_OPTIONS = [
  "Computer Science",
  "Information Science",
  "Electronics & Communication (ECE)",
  "Electrical & Electronics",
  "Electronics & Instrumentation",
  "Mechanical",
  "Civil",
  "Industrial Engineering & Management",
  "Chemical",
  "Biotechnology",
  "Medical Electronics",
  "Telecommunication",
  "Aerospace",
  "Architecture",
];

export const BRANCHES: readonly string[] = [
  ...[...BRANCH_OPTIONS].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  ),
  "Other",
];

export const EXPERIENCE_LEVELS = [
  "Entry-level",
  "1-3 years",
  "3-5 years",
  "5+ years",
] as const;

export const MENTOR_EXPERTISE = [
  "Software Engineering",
  "Product Management",
  "Data & AI/ML",
  "Design / UX",
  "Hardware & Electronics",
  "Civil & Structural",
  "Mechanical & Manufacturing",
  "Entrepreneurship / Startups",
  "Consulting",
  "Finance",
  "Higher Studies / Grad School",
  "Research",
] as const;

// Standard industry list for the Directory (filterable, consistent). Sorted at
// the source; "Other" stays last as the catch-all.
const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Consulting",
  "Manufacturing",
  "Education",
  "Government",
  "Design",
  "Media",
  "Legal",
  "Retail",
  "Energy",
  "Real Estate",
  "Nonprofit",
];

export const INDUSTRIES: readonly string[] = [
  ...[...INDUSTRY_OPTIONS].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  ),
  "Other",
];

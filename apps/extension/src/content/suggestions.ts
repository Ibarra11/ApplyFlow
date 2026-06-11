import type { Resume } from "@applyflow/schema";
import type { FieldKind, FillableElement } from "./field-detector";
import { detectFieldKinds } from "./field-detector";

export type Suggestion = {
  /** Short description of what this value is, e.g. "Email" or "Most recent title". */
  label: string;
  value: string;
};

function clean(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function push(list: Suggestion[], label: string, value: string | null) {
  if (value) list.push({ label, value });
}

/**
 * Builds the candidate values for every field kind from the stored resume,
 * each list already ordered with the best/most-recent option first.
 */
function suggestionsByKind(resume: Resume): Record<FieldKind, Suggestion[]> {
  debugger;
  const firstName = clean(resume.firstName);
  const lastName = clean(resume.lastName);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || null;

  const titles: Suggestion[] = [];
  const companies: Suggestion[] = [];
  resume.jobs.forEach((job, index) => {
    const recency = index === 0 ? "Most recent" : "Previous";
    push(titles, `${recency} title`, clean(job.title));
    push(companies, `${recency} company`, clean(job.companyName));
  });

  const schools: Suggestion[] = [];
  const degrees: Suggestion[] = [];
  const locations: Suggestion[] = [];
  resume.education.forEach((edu) => {
    push(schools, "School", clean(edu.schoolName));
    push(degrees, "Degree", clean(edu.degree));
    push(locations, "Location", clean(edu.location));
  });

  const allSkills = Object.values(resume.skills).flat().filter(Boolean);
  const skills: Suggestion[] = [];
  if (allSkills.length > 0) {
    push(skills, "All skills", allSkills.join(", "));
  }

  const fullNameList: Suggestion[] = [];
  push(fullNameList, "Full name", fullName);

  const firstNameList: Suggestion[] = [];
  push(firstNameList, "First name", firstName);

  const lastNameList: Suggestion[] = [];
  push(lastNameList, "Last name", lastName);

  return {
    fullname: fullNameList,
    firstname: firstNameList,
    lastname: lastNameList,
    email: clean(resume.email)
      ? [{ label: "Email", value: resume.email! }]
      : [],
    phone: clean(resume.phone)
      ? [{ label: "Phone", value: resume.phone! }]
      : [],
    linkedin: clean(resume.linkedin)
      ? [{ label: "LinkedIn", value: resume.linkedin! }]
      : [],
    github: clean(resume.github)
      ? [{ label: "GitHub", value: resume.github! }]
      : [],
    portfolio: clean(resume.website)
      ? [{ label: "Website", value: resume.website! }]
      : [],
    title: titles,
    company: companies,
    school: schools,
    degree: degrees,
    location: locations,
    skills,
    summary: clean(resume.summary)
      ? [{ label: "Summary", value: resume.summary! }]
      : [],
  };
}

/** Fallback order for values that don't match the detected field kind. */
const ALL_KINDS_ORDER: FieldKind[] = [
  "fullname",
  "firstname",
  "lastname",
  "email",
  "phone",
  "linkedin",
  "github",
  "portfolio",
  "title",
  "company",
  "school",
  "degree",
  "location",
  "skills",
  "summary",
];

/**
 * Returns suggestions for a given input: any values matching the detected field
 * kind come first (recommended first), followed by every other resume value so
 * nothing is ever hidden. De-duplicated by value.
 */
export function suggestionsForInput(
  el: FillableElement,
  resume: Resume,
): Suggestion[] {
  const byKind = suggestionsByKind(resume);
  const seen = new Set<string>();
  const result: Suggestion[] = [];

  const add = (suggestion: Suggestion) => {
    if (seen.has(suggestion.value)) return;
    seen.add(suggestion.value);
    result.push(suggestion);
  };

  // Detected matches first, in best-recommended order.
  for (const kind of detectFieldKinds(el)) {
    byKind[kind].forEach(add);
  }

  // Then everything else from the resume as fallback options.
  for (const kind of ALL_KINDS_ORDER) {
    byKind[kind].forEach(add);
  }

  return result;
}

/** Case-insensitive filter on what the user has already typed. */
export function filterSuggestions(
  suggestions: Suggestion[],
  query: string,
): Suggestion[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return suggestions;
  return suggestions.filter((s) => {
    const value = s.value.toLowerCase();
    // Hide an exact match so we don't suggest what's already there.
    if (value === trimmed) return false;
    return value.includes(trimmed) || s.label.toLowerCase().includes(trimmed);
  });
}

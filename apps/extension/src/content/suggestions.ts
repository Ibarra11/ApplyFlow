import type { Resume } from "@applyflow/schema";

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
 * Builds every suggestion from the stored resume in a fixed, sensible order.
 * No field detection: the dropdown shows all of them and the text filter
 * narrows the list as the user types.
 */
export function suggestionsForInput(resume: Resume): Suggestion[] {
  const list: Suggestion[] = [];
  const seen = new Set<string>();

  const add = (label: string, value: string | null) => {
    const cleaned = clean(value);
    if (!cleaned || seen.has(cleaned)) return;
    seen.add(cleaned);
    push(list, label, cleaned);
  };

  const firstName = clean(resume.firstName);
  const lastName = clean(resume.lastName);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || null;

  add("Full name", fullName);
  add("First name", firstName);
  add("Last name", lastName);
  add("Email", resume.email);
  add("Phone", resume.phone);
  add("LinkedIn", resume.linkedin);
  add("GitHub", resume.github);
  add("Website", resume.website);

  resume.jobs.forEach((job, index) => {
    const recency = index === 0 ? "Most recent" : "Previous";
    add(`${recency} title`, job.title);
    add(`${recency} company`, job.companyName);
  });

  resume.education.forEach((edu) => {
    add("School", edu.schoolName);
    add("Degree", edu.degree);
    add("Location", edu.location);
  });

  const allSkills = Object.values(resume.skills).flat().filter(Boolean);
  if (allSkills.length > 0) add("All skills", allSkills.join(", "));

  add("Summary", resume.summary);

  return list;
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

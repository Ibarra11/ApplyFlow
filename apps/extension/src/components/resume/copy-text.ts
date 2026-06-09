import type {
  Resume,
  ResumeEducation,
  ResumeJob,
  ResumeSkills,
} from "@/lib/types";
import { SKILL_CATEGORIES } from "@/lib/types";

function joinTruthy(parts: (string | null | undefined)[], sep: string) {
  return parts.filter(Boolean).join(sep);
}

export function dateRangeText(
  start: string | null,
  end: string | null,
): string {
  return joinTruthy([start, end], " – ");
}

export function fullNameText(resume: Resume): string {
  return joinTruthy([resume.firstName, resume.lastName], " ");
}

export function contactText(resume: Resume): string {
  return [
    fullNameText(resume),
    resume.email,
    resume.phone,
    resume.linkedin,
    resume.github,
    resume.website,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Formats a list of detail bullets as one "• …" line each, for easy pasting. */
export function bulletsText(details: string[]): string {
  return details.map((detail) => `• ${detail}`).join("\n");
}

export function jobText(job: ResumeJob): string {
  const heading = joinTruthy([job.title, job.companyName], " — ");
  const range = dateRangeText(job.startDate, job.endDate);
  const lines = [range ? `${heading} (${range})` : heading].filter(Boolean);
  for (const detail of job.details) lines.push(`• ${detail}`);
  return lines.join("\n");
}

export function experienceText(jobs: ResumeJob[]): string {
  return jobs.map(jobText).join("\n\n");
}

export function educationText(items: ResumeEducation[]): string {
  return items
    .map((item) => {
      const range = dateRangeText(item.startDate, item.endDate);
      const heading = joinTruthy(
        [item.schoolName, item.degree, item.location],
        " · ",
      );
      const lines = [range ? `${heading} (${range})` : heading].filter(Boolean);
      for (const detail of item.details ?? []) lines.push(`• ${detail}`);
      return lines.join("\n");
    })
    .join("\n\n");
}

export function skillsText(skills: ResumeSkills): string {
  return SKILL_CATEGORIES.filter(({ key }) => (skills[key] ?? []).length > 0)
    .map(({ key, label }) => `${label}: ${skills[key].join(", ")}`)
    .join("\n");
}

type ResumeWithUrls = {
  linkedin: string | null;
  github: string | null;
  website: string | null;
  projects: Array<{ url: string | null } & Record<string, unknown>>;
};

function normalizeUrl(value: string | null): string | null {
  if (!value?.trim()) return null;

  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return `https://www.${trimmed}`;
}

export function normalizeResumeUrls<T extends ResumeWithUrls>(resume: T): T {
  return {
    ...resume,
    linkedin: normalizeUrl(resume.linkedin),
    github: normalizeUrl(resume.github),
    website: normalizeUrl(resume.website),
    projects: resume.projects.map((project) => ({
      ...project,
      url: normalizeUrl(project.url),
    })),
  };
}

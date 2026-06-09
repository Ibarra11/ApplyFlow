export interface ResumeJob {
  companyName: string | null;
  title: string | null;
  startDate: string | null;
  endDate: string | null;
  details: string[];
}

export interface ResumeEducation {
  schoolName: string | null;
  degree: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  details: string[] | null;
}

export interface ResumeSkills {
  languages: string[];
  frontend: string[];
  backend: string[];
  databasesSearch: string[];
  infrastructure: string[];
  aiEngineering: string[];
  other: string[];
}

export type ResumeSkillCategory = keyof ResumeSkills;

export interface Resume {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  website: string | null;
  summary: string | null;
  jobs: ResumeJob[];
  education: ResumeEducation[];
  skills: ResumeSkills;
}

/** A parsed resume persisted to extension storage, with source metadata. */
export interface StoredResume {
  /** Original uploaded file name. */
  name: string;
  resume: Resume;
  /** Epoch milliseconds of the last parse or edit. */
  updatedAt: number;
}

export const SKILL_CATEGORIES: { key: ResumeSkillCategory; label: string }[] = [
  { key: "languages", label: "Languages" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "databasesSearch", label: "Databases & Search" },
  { key: "infrastructure", label: "Infrastructure" },
  { key: "aiEngineering", label: "AI Engineering" },
  { key: "other", label: "Other" },
];

export function emptySkills(): ResumeSkills {
  return {
    languages: [],
    frontend: [],
    backend: [],
    databasesSearch: [],
    infrastructure: [],
    aiEngineering: [],
    other: [],
  };
}

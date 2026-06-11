import { z } from "zod";

export const resumeJobSchema = z.object({
  companyName: z.string().nullable(),
  title: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  details: z.array(z.string()),
});

export const resumeEducationSchema = z.object({
  schoolName: z.string().nullable(),
  degree: z.string().nullable(),
  location: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  details: z.array(z.string()).nullable(),
});

export const resumeSkillsSchema = z.object({
  languages: z.array(z.string()),
  frontend: z.array(z.string()),
  backend: z.array(z.string()),
  databasesSearch: z.array(z.string()),
  infrastructure: z.array(z.string()),
  aiEngineering: z.array(z.string()),
  other: z.array(z.string()),
});

export const resumeSchema = z.object({
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  linkedin: z.string().nullable(),
  github: z.string().nullable(),
  website: z.string().nullable(),
  summary: z.string().nullable(),
  jobs: z.array(resumeJobSchema),
  education: z.array(resumeEducationSchema),
  skills: resumeSkillsSchema,
});

export const parseResumeResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    name: z.string(),
    resume: resumeSchema,
  }),
});

export const storedResumeSchema = z.object({
  name: z.string(),
  resume: resumeSchema,
  updatedAt: z.number(),
});

export const answerQuestionRequestSchema = z.object({
  question: z.string().min(1).max(2000),
  resume: resumeSchema,
});

export const answerQuestionResponseSchema = z.object({
  answer: z.string(),
});
export type AnswerQuestionRequest = z.infer<typeof answerQuestionRequestSchema>;
export type AnswerQuestionResponse = z.infer<
  typeof answerQuestionResponseSchema
>;

export type ResumeJob = z.infer<typeof resumeJobSchema>;
export type ResumeEducation = z.infer<typeof resumeEducationSchema>;
export type ResumeSkills = z.infer<typeof resumeSkillsSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type ParseResumeResponse = z.infer<typeof parseResumeResponseSchema>;
export type StoredResume = z.infer<typeof storedResumeSchema>;
export type ResumeSkillCategory = keyof ResumeSkills;

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

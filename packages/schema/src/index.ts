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

export const resumeProjectSchema = z.object({
  name: z.string().nullable(),
  url: z.string().nullable(),
  details: z.array(z.string()),
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
  jobs: z.array(resumeJobSchema),
  projects: z.array(resumeProjectSchema),
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

export const jobDescriptionSchema = z.object({
  title: z.string().nullable(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  employmentType: z.string().nullable(),
  summary: z.string().nullable(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  niceToHave: z.array(z.string()),
  skills: z.array(z.string()),
});

export const parseJobRequestSchema = z.object({
  text: z.string().min(1).max(20000),
});

export const parseJobResponseSchema = z.object({
  jobDescription: jobDescriptionSchema,
});

export const storedJobSchema = z.object({
  jobDescription: jobDescriptionSchema,
  url: z.string().nullable().optional(),
  updatedAt: z.number(),
});

export const applicationStatusSchema = z.enum([
  "pending",
  "interviewing",
  "offer",
  "rejected",
]);

export const APPLICATION_STATUSES = applicationStatusSchema.options;

export const applicationSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  title: z.string().nullable(),
  company: z.string().nullable(),
  status: applicationStatusSchema,
  dateApplied: z.string(),
  createdAt: z.string(),
});

export const createApplicationRequestSchema = z.object({
  url: z.string().url(),
  title: z.string().nullable(),
  company: z.string().nullable(),
});

export const updateApplicationStatusRequestSchema = z.object({
  status: applicationStatusSchema,
});

export const applicationIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const applicationResponseSchema = z.object({
  application: applicationSchema,
});

export const applicationByUrlResponseSchema = z.object({
  application: applicationSchema.nullable(),
});

export const applicationsResponseSchema = z.object({
  applications: z.array(applicationSchema),
});

export const applicationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: applicationStatusSchema.optional(),
});

export const paginatedApplicationsResponseSchema = z.object({
  applications: z.array(applicationSchema),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
});

export const applicationByUrlQuerySchema = z.object({
  url: z.url(),
});

export const answerQuestionRequestSchema = z.object({
  question: z.string().min(1).max(2000),
  resume: resumeSchema,
  jobDescription: jobDescriptionSchema.nullable().optional(),
});

export const answerQuestionResponseSchema = z.object({
  answer: z.string(),
});

export const coverLetterStyleSchema = z.enum([
  "concise",
  "technical",
  "traditional",
  "startup",
]);

export const COVER_LETTER_STYLES = coverLetterStyleSchema.options;

export const coverLetterRequestSchema = z.object({
  resume: resumeSchema,
  jobDescription: jobDescriptionSchema,
  style: coverLetterStyleSchema.default("concise"),
});

export const coverLetterResponseSchema = z.object({
  coverLetter: z.string(),
});

export const jobMatchResultSchema = z.object({
  score: z.number().min(0).max(10),
  summary: z.string(),
  strengths: z.array(z.string()),
  missingSkills: z.array(z.string()),
  experienceGaps: z.array(z.string()),
});

export const jobMatchRequestSchema = z.object({
  resume: resumeSchema,
  jobDescription: jobDescriptionSchema,
});

export const jobMatchResponseSchema = z.object({
  match: jobMatchResultSchema,
});

export type AnswerQuestionRequest = z.infer<typeof answerQuestionRequestSchema>;
export type AnswerQuestionResponse = z.infer<
  typeof answerQuestionResponseSchema
>;
export type CoverLetterRequest = z.infer<typeof coverLetterRequestSchema>;
export type CoverLetterResponse = z.infer<typeof coverLetterResponseSchema>;
export type CoverLetterStyle = z.infer<typeof coverLetterStyleSchema>;

export type ResumeJob = z.infer<typeof resumeJobSchema>;
export type ResumeProject = z.infer<typeof resumeProjectSchema>;
export type ResumeEducation = z.infer<typeof resumeEducationSchema>;
export type ResumeSkills = z.infer<typeof resumeSkillsSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type ParseResumeResponse = z.infer<typeof parseResumeResponseSchema>;
export type StoredResume = z.infer<typeof storedResumeSchema>;
export type JobDescription = z.infer<typeof jobDescriptionSchema>;
export type ParseJobRequest = z.infer<typeof parseJobRequestSchema>;
export type ParseJobResponse = z.infer<typeof parseJobResponseSchema>;
export type StoredJob = z.infer<typeof storedJobSchema>;
export type Application = z.infer<typeof applicationSchema>;
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
export type CreateApplicationRequest = z.infer<
  typeof createApplicationRequestSchema
>;
export type UpdateApplicationStatusRequest = z.infer<
  typeof updateApplicationStatusRequestSchema
>;
export type ApplicationIdParams = z.infer<typeof applicationIdParamsSchema>;
export type ApplicationResponse = z.infer<typeof applicationResponseSchema>;
export type ApplicationByUrlResponse = z.infer<
  typeof applicationByUrlResponseSchema
>;
export type ApplicationsResponse = z.infer<typeof applicationsResponseSchema>;
export type ApplicationsQuery = z.infer<typeof applicationsQuerySchema>;
export type PaginatedApplicationsResponse = z.infer<
  typeof paginatedApplicationsResponseSchema
>;
export type ApplicationByUrlQuery = z.infer<typeof applicationByUrlQuerySchema>;
export type JobMatchResult = z.infer<typeof jobMatchResultSchema>;
export type JobMatchRequest = z.infer<typeof jobMatchRequestSchema>;
export type JobMatchResponse = z.infer<typeof jobMatchResponseSchema>;
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

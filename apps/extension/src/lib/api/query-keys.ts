export const queryKeys = {
  resume: {
    all: ["resume"] as const,
    parsed: () => [...queryKeys.resume.all, "parsed"] as const,
  },
  job: {
    all: ["job"] as const,
    parsed: () => [...queryKeys.job.all, "parsed"] as const,
  },
} as const;

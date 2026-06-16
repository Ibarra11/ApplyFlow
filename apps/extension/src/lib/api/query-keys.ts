export const queryKeys = {
  resume: {
    all: ["resume"] as const,
    parsed: () => [...queryKeys.resume.all, "parsed"] as const,
  },
  job: {
    all: ["job"] as const,
    parsed: () => [...queryKeys.job.all, "parsed"] as const,
  },
  application: {
    all: ["application"] as const,
    byUrl: (url: string) =>
      [...queryKeys.application.all, "by-url", url] as const,
    list: () => [...queryKeys.application.all, "list"] as const,
  },
} as const;

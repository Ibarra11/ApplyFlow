export const queryKeys = {
  resume: {
    all: ["resume"] as const,
    parsed: () => [...queryKeys.resume.all, "parsed"] as const,
  },
} as const;

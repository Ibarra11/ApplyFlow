import { useMutation } from "@tanstack/react-query";
import {
  jobMatchResponseSchema,
  type JobDescription,
  type Resume,
} from "@applyflow/schema";

import { api } from "@/lib/api/api";

export function useMatchJob() {
  return useMutation({
    mutationFn: async (vars: {
      resume: Resume;
      jobDescription: JobDescription;
    }) => {
      const { data } = await api.post("/ai/match", vars);
      return jobMatchResponseSchema.parse(data).match;
    },
  });
}

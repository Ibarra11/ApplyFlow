import { useMutation } from "@tanstack/react-query";
import {
  coverLetterResponseSchema,
  type CoverLetterStyle,
  type JobDescription,
  type Resume,
} from "@applyflow/schema";

import { api } from "@/lib/api/api";

export function useGenerateCoverLetter() {
  return useMutation({
    mutationFn: async (vars: {
      resume: Resume;
      jobDescription: JobDescription;
      style?: CoverLetterStyle;
    }) => {
      const { data } = await api.post("/ai/cover-letter", vars);
      return coverLetterResponseSchema.parse(data).coverLetter;
    },
  });
}

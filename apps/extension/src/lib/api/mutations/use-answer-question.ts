import { useMutation } from "@tanstack/react-query";
import {
  answerQuestionResponseSchema,
  type JobDescription,
  type Resume,
} from "@applyflow/schema";

import { api } from "@/lib/api/api";

export function useAnswerQuestion() {
  return useMutation({
    mutationFn: async (vars: {
      question: string;
      resume: Resume;
      jobDescription?: JobDescription | null;
    }) => {
      const { data } = await api.post("/ai/answer", vars);
      return answerQuestionResponseSchema.parse(data).answer;
    },
  });
}

import { useMutation } from "@tanstack/react-query";
import { parseJobResponseSchema, type StoredJob } from "@applyflow/schema";

import { api } from "@/lib/api/api";
import { storage } from "../../storage";
import { queryClient } from "../query-client";
import { queryKeys } from "../query-keys";

async function parseJob(text: string): Promise<StoredJob> {
  const { data } = await api.post("/job/parse", { text });

  const { jobDescription } = parseJobResponseSchema.parse(data);

  return {
    jobDescription,
    updatedAt: Date.now(),
  };
}

export function useParseJob() {
  return useMutation({
    mutationFn: parseJob,
    onSuccess: async (stored) => {
      await storage.setParsedJob(stored);
      queryClient.setQueryData(queryKeys.job.parsed(), stored);
    },
  });
}

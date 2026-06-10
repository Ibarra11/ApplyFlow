import { useMutation } from "@tanstack/react-query";
import { parseResumeResponseSchema, type StoredResume } from "@applyflow/schema";
import { api } from "@/lib/api/api";
import { storage } from "../../storage";
import { queryClient } from "../query-client";
import { queryKeys } from "../query-keys";

async function parseResume(file: File): Promise<StoredResume> {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await api.post("/resume/parse", formData);

  // Validate the API response so a malformed payload fails loudly here
  // rather than surfacing as a confusing render error downstream.
  const { data: payload } = parseResumeResponseSchema.parse(data);

  return {
    name: payload.name,
    resume: payload.resume,
    updatedAt: Date.now(),
  };
}

export function useParseResume() {
  return useMutation({
    mutationFn: parseResume,
    onSuccess: async (stored) => {
      await storage.setParsedResume(stored);
      queryClient.setQueryData(queryKeys.resume.parsed(), stored);
    },
  });
}

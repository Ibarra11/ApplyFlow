import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import type { Resume, StoredResume } from "@/lib/types";
import { storage } from "../../storage";
import { queryClient } from "../query-client";
import { queryKeys } from "../query-keys";

interface ParseResumeResponse {
  message: string;
  data: {
    name: string;
    resume: Resume;
  };
}

async function parseResume(file: File): Promise<StoredResume> {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await api.post<ParseResumeResponse>(
    "/resume/parse",
    formData,
  );

  return {
    name: data.data.name,
    resume: data.data.resume,
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

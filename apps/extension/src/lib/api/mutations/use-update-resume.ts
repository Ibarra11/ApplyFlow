import { useMutation } from "@tanstack/react-query";
import type { Resume, StoredResume } from "@/lib/types";
import { storage } from "../../storage";
import { queryClient } from "../query-client";
import { queryKeys } from "../query-keys";

async function updateResume(patch: Partial<Resume>): Promise<StoredResume> {
  const current = await storage.getParsedResume();

  if (!current) {
    throw new Error("No parsed resume to update");
  }

  const updated: StoredResume = {
    ...current,
    resume: { ...current.resume, ...patch },
    updatedAt: Date.now(),
  };

  await storage.setParsedResume(updated);
  return updated;
}

export function useUpdateResume() {
  return useMutation({
    mutationFn: updateResume,
    onSuccess: (stored) => {
      queryClient.setQueryData(queryKeys.resume.parsed(), stored);
    },
  });
}

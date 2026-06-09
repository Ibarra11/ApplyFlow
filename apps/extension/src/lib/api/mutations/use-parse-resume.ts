import { useMutation, type QueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import { storage } from "../../storage";
import { queryClient } from "../query-client";
import { queryKeys } from "../query-keys";

async function parseResume(file: File) {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await api.post("/resume/parse", formData);
  return data;
}

export function useParseResume(
  queryOptions?: Omit<QueryOptions, "mutationFn">,
) {
  return useMutation({
    mutationFn: parseResume,
    onSuccess: async ({ data }) => {
      debugger;
      await storage.setParsedResume(data);
      queryClient.setQueryData(queryKeys.resume.parsed(), data.resume);
    },
    ...queryOptions,
  });
}

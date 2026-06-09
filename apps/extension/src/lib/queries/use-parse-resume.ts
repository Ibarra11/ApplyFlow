import { useMutation, type QueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

type ParseResumeResponse = {
  name: string;
  pages: number;
  text: string;
};

async function parseResume(file: File): Promise<ParseResumeResponse> {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await api.post<ParseResumeResponse>(
    "/resume/parse",
    formData,
  );
  return data;
}

export function useParseResume(
  queryOptions?: Omit<QueryOptions, "mutationFn">,
) {
  return useMutation({
    mutationFn: parseResume,
    ...queryOptions,
  });
}

import { useQuery } from "@tanstack/react-query";
import { applicationByUrlResponseSchema } from "@applyflow/schema";

import { api } from "@/lib/api/api";
import { queryKeys } from "../query-keys";

export function useApplicationStatus(url: string | null) {
  return useQuery({
    queryKey: queryKeys.application.byUrl(url ?? ""),
    queryFn: async () => {
      const { data } = await api.get("/applications/by-url", {
        params: { url },
      });
      return applicationByUrlResponseSchema.parse(data).application;
    },
    enabled: !!url,
  });
}

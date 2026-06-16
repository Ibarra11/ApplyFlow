import { useMutation } from "@tanstack/react-query";
import {
  applicationResponseSchema,
  type CreateApplicationRequest,
} from "@applyflow/schema";

import { api } from "@/lib/api/api";
import { queryClient } from "../query-client";
import { queryKeys } from "../query-keys";

export function useTrackApplication() {
  return useMutation({
    mutationFn: async (vars: CreateApplicationRequest) => {
      const { data } = await api.post("/applications", vars);
      return applicationResponseSchema.parse(data).application;
    },
    onSuccess: (application) => {
      queryClient.setQueryData(
        queryKeys.application.byUrl(application.url),
        application,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.application.list() });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applicationResponseSchema,
  type ApplicationStatus,
} from "@applyflow/schema";

import { api } from "./api";

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { id: string; status: ApplicationStatus }) => {
      const { data } = await api.patch(`/applications/${vars.id}`, {
        status: vars.status,
      });
      return applicationResponseSchema.parse(data).application;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

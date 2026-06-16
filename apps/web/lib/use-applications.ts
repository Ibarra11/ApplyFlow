import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { paginatedApplicationsResponseSchema } from "@applyflow/schema";

import { api } from "./api";

export const PAGE_SIZE = 10;

export function useApplications(page: number, pageSize = PAGE_SIZE) {
  return useQuery({
    queryKey: ["applications", page, pageSize],
    queryFn: async () => {
      const { data } = await api.get("/applications", {
        params: { page, pageSize },
      });
      return paginatedApplicationsResponseSchema.parse(data);
    },
    placeholderData: keepPreviousData,
  });
}

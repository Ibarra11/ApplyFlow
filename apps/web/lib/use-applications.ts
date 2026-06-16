import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  paginatedApplicationsResponseSchema,
  type ApplicationStatus,
} from "@applyflow/schema";

import { api } from "./api";

export const PAGE_SIZE = 10;

export type StatusFilter = ApplicationStatus | "all";

export function useApplications(
  page: number,
  status: StatusFilter = "all",
  pageSize = PAGE_SIZE,
) {
  return useQuery({
    queryKey: ["applications", page, pageSize, status],
    queryFn: async () => {
      const { data } = await api.get("/applications", {
        params: {
          page,
          pageSize,
          ...(status !== "all" ? { status } : {}),
        },
      });
      return paginatedApplicationsResponseSchema.parse(data);
    },
    placeholderData: keepPreviousData,
  });
}

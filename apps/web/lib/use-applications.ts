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
  search?: string,
) {
  const trimmedSearch = search?.trim();

  return useQuery({
    queryKey: ["applications", page, pageSize, status, trimmedSearch ?? ""],
    queryFn: async () => {
      const { data } = await api.get("/applications", {
        params: {
          page,
          pageSize,
          ...(status !== "all" ? { status } : {}),
          ...(trimmedSearch ? { q: trimmedSearch } : {}),
        },
      });
      return paginatedApplicationsResponseSchema.parse(data);
    },
    placeholderData: keepPreviousData,
  });
}

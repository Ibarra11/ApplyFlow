import { useQuery } from "@tanstack/react-query";

import { storage } from "@/lib/storage";
import { queryKeys } from "../query-keys";

export function useParsedJob() {
  return useQuery({
    queryKey: queryKeys.job.parsed(),
    queryFn: () => storage.getParsedJob(),
  });
}

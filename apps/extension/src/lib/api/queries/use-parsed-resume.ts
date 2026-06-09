import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { storage } from "@/lib/storage";

export function useParsedResume() {
  return useQuery({
    queryKey: queryKeys.resume.parsed(),
    queryFn: () => storage.getParsedResume(),
  });
}

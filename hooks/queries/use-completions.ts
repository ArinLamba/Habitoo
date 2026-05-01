// /hooks/queries/useCompletions.ts

import { getCompletions } from "@/db/queries";
import { useRangeStore } from "@/store/use-range-store";
import { useQuery } from "@tanstack/react-query";

// useCompletions.ts
export const useCompletions = () => {
  const range = useRangeStore(s => s.range);
  console.log("RANGE:", range);

  return useQuery({
    queryKey: ["completions", range],
    queryFn: () => getCompletions(range),


    // staleTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 0,
    gcTime: 1000 * 60 * 30,

    refetchOnWindowFocus: false,
    // refetchOnMount: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};
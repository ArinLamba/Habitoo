// /hooks/queries/useCompletions.ts

import { getCompletions } from "@/db/queries";
import { useRangeStore } from "@/store/use-range-store";
import { useQuery } from "@tanstack/react-query";

// useCompletions.ts

export const useCompletions = () => {
  const range = useRangeStore(s => s.range);

  return useQuery({
    // Add today's date to the queryKey so it refetches if the day changes
    queryKey: ["completions", range, new Date().toLocaleDateString('en-CA')], 
    queryFn: () => {
      // Get the local date in YYYY-MM-DD format
      const localToday = new Date().toLocaleDateString('en-CA');
      return getCompletions(range, localToday);
    },

    staleTime: 1000 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: false,
  });
};
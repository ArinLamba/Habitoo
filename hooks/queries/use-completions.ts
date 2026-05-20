// /hooks/queries/useCompletions.ts

import { getCompletions } from "@/db/queries";

import { useQuery } from "@tanstack/react-query";

// useCompletions.ts

export const useCompletions = (range: number | "all" = 90) => {

  // Get the local date in YYYY-MM-DD format
  const localToday = new Date().toLocaleDateString('en-CA');

  return useQuery({
    // Add today's date to the queryKey so it refetches if the day changes
    queryKey: ["completions", range, localToday], 
    queryFn: () => {
      return getCompletions(range, localToday);
    },

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

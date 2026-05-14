// /hooks/queries/useCompletions.ts

import { getCompletions } from "@/db/queries";

import { useQuery } from "@tanstack/react-query";

// useCompletions.ts

export const useCompletions = () => {

  // Get the local date in YYYY-MM-DD format
  const localToday = new Date().toLocaleDateString('en-CA');

  return useQuery({
    // Add today's date to the queryKey so it refetches if the day changes
    queryKey: ["completions", localToday], 
    queryFn: () => {
      return getCompletions(90, localToday);
    },

    staleTime: 1000 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
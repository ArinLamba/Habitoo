// /hooks/queries/useHabits.ts

import { getHabits } from "@/db/queries";
import { useQuery } from "@tanstack/react-query";


export const useHabits = () => {
  return useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,

    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
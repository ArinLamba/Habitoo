// /hooks/queries/useHabits.ts


import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

import { getHabits } from "@/db/queries";

export const useHabits = () => {
  const { isSignedIn } = useAuth();
  return useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,

    enabled: !!isSignedIn,

    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
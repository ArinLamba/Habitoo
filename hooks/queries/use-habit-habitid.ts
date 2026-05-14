
import { getHabitById } from "@/db/queries";
import { useQuery } from "@tanstack/react-query";

export const useHabitById = (habitId: string, enabled: boolean) => {


  return useQuery({
    queryKey: ["habit", habitId],
    queryFn: () => getHabitById(habitId!),

    enabled,
    staleTime: 1000 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
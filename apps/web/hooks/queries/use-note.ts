import { getNoteByDate } from "@/db/queries";
import { useQuery } from "@tanstack/react-query";

export const useNote = (date: string) => {
  return useQuery({
    queryKey: ["note", date],
    queryFn: async () => {
      return (await getNoteByDate(date)) ?? null;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

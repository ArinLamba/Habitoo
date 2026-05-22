// import { getCompletionsByHabitId } from "@/db/queries";
// import { useRangeStore } from "@/store/use-range-store";
// import { useQuery } from "@tanstack/react-query";

// export const useCompletionsByHabitId = (habitId: string) => {
//   const range = useRangeStore(s => s.range);
//   const localToday = new Date().toLocaleDateString('en-CA');

//   return useQuery({
//     queryKey: ["completions", range, habitId, localToday],
//     queryFn: () => {
//       return getCompletionsByHabitId(habitId, range, localToday);
//     },

//     enabled: !!habitId,
//     staleTime: 1000 * 10,
//     gcTime: 1000 * 60 * 30,
//     refetchOnWindowFocus: false,
//     refetchOnMount: "always",
//     refetchOnReconnect: false,
//   });
// };
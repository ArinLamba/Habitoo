// "use client";
// import { Habit } from "@/lib/types"


// import { useMemo } from "react";
// import { useCompletionsByHabitId } from "./queries/use-completions-habitid";
// import { buildHabitStats } from "@/lib/build-habit-stats";



// export const useHabitStats = (habit: Habit) => {
  
//   const { data: completions = [] } = useCompletionsByHabitId(habit.id);

//   return useMemo(() => {
//     return buildHabitStats(habit, completions);
//   },[completions, habit]);
// };

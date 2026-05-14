import { useMemo } from "react";
import { buildStats } from "@/lib/build-stats";
import { Habit, Completion } from "@/lib/types";

export const useStats = (
  habits: Habit[],
  completions: Completion[]
) => {
  return useMemo(() => {
    return buildStats(habits, completions);
  }, [habits, completions]);
};
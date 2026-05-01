import { useMemo } from "react";
import { buildStats } from "@/lib/stats-engine";
import { Habit, Completion } from "@/lib/types";

export const useStats = (
  habits: Habit[],
  completions: Completion[]
) => {
  return useMemo(() => {
    return buildStats(habits, completions);
  }, [habits, completions]);
};
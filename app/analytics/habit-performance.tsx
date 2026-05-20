import { useMemo } from "react";

import { getHabitPerformance } from "@/lib/insights";
import { Completion, Habit } from "@/lib/types";

export const HabitPerformance = ({
  habits,
  completions,
}: {
  habits: Habit[];
  completions: Completion[];
}) => {
  const data = useMemo(() => {
    return getHabitPerformance(habits, completions)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8);
  }, [habits, completions]);

  return (
    <section className="rounded-md border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Habit health
          </p>
          <h2 className="mt-1 text-lg font-semibold">
            Which habits are carrying the month
          </h2>
        </div>
      </div>

      <div className="grid gap-3">
        {data.map((habit) => (
          <div key={`${habit.name}-${habit.percentage}`}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{habit.name}</span>
              <span className="text-muted-foreground">
                {habit.percentage}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${habit.percentage}%` }}
              />
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No habit data yet.
          </p>
        )}
      </div>
    </section>
  );
};

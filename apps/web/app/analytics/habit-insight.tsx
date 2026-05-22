import { Completion, Habit, HABIT_STATUS } from "@/lib/types";

export const HabitInsights = ({
  habits,
  completions,
}: {
  habits: Habit[];
  completions: Completion[];
}) => {
  const map = new Map<string, number>();

  habits.forEach((habit) => map.set(habit.id, 0));

  completions.forEach((completion) => {
    if (completion.status === HABIT_STATUS.COMPLETED) {
      map.set(
        completion.habitId,
        (map.get(completion.habitId) || 0) + 1
      );
    }
  });

  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
  const best = habits.find((habit) => habit.id === sorted[0]?.[0]);
  const worst = habits.find(
    (habit) => habit.id === sorted[sorted.length - 1]?.[0]
  );

  return (
    <div className="rounded-md border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Habit signals
      </p>

      <div className="mt-4 grid gap-3">
        <div className="rounded-md bg-emerald-500/10 p-3">
          <p className="text-xs text-muted-foreground">
            Most logged
          </p>
          <p className="mt-1 text-sm font-semibold">
            {best?.name || "-"}
          </p>
        </div>

        <div className="rounded-md bg-amber-500/10 p-3">
          <p className="text-xs text-muted-foreground">
            Needs a nudge
          </p>
          <p className="mt-1 text-sm font-semibold">
            {worst?.name || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

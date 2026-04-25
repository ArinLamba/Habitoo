import { Completion, Habit } from "@/lib/types";

export const HabitInsights = ({ habits, completions }: {
  habits: Habit[];
  completions: Completion[];
}) => {

  const map = new Map<string, number>();

  habits.forEach(h => map.set(h.id, 0));

  completions.forEach(c => {
    if (c.completed) {
      map.set(c.habitId, (map.get(c.habitId) || 0) + 1);
    }
  });

  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);

  const best = habits.find(h => h.id === sorted[0]?.[0]);
  const worst = habits.find(h => h.id === sorted[sorted.length - 1]?.[0]);

  return (
    <div className="p-4 rounded-lg border shadow-md bg-white dark:bg-zinc-900">
      <p className="text-sm text-muted-foreground mb-3">🧠 Insights</p>

      <p className="text-sm">
        🟢 Most consistent: <b>{best?.name || "-"}</b>
      </p>

      <p className="text-sm mt-1">
        🔴 Needs attention: <b>{worst?.name || "-"}</b>
      </p>
    </div>
  );
};
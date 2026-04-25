"use client";

import { Habit, Completion } from "@/lib/types";
import { getAllHabitStreaks } from "@/lib/helper";

export const HabitStreakList = ({
  habits,
  completions,
}: {
  habits: Habit[];
  completions: Completion[];
}) => {

  const data = getAllHabitStreaks(habits, completions);

  return (
    <div className="p-4 rounded-lg border shadow-md bg-white dark:bg-zinc-900">
      <p className="text-sm text-muted-foreground mb-4">
        🔥 Habit Streaks
      </p>

      <div className="flex flex-col gap-3">
        {data.map(h => (
          <div
            key={h.habitId}
            className="flex justify-between items-center"
          >
            <span className="text-sm">{h.name}</span>

            <div className="flex gap-4 text-sm">
              <span>🔥 {h.currentStreak}</span>
              <span className="text-muted-foreground">
                🏆 {h.bestStreak}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
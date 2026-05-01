"use client";

import { useHabitStats } from "@/hooks/use-habit-stats";

export const HabitStatsCompact = () => {
  const stats = useHabitStats();

  if (!stats) return null;

  const items = [
    {
      label: "Consistency",
      value: `${stats.consistency}%`,
    },
    {
      label: "Current",
      value: `🔥 ${stats.currentStreak}`,
    },
    {
      label: "Best",
      value: `🏆 ${stats.bestStreak}`,
    },
    {
      label: "Week",
      value: `${stats.weekDone}/7`,
    },
  ];

  return (
    <div className="mt-3">
      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">

        {items.map((item, i) => (
          <div
            key={i}
            className="
              min-w-[90px]
              px-3 py-2
              rounded-xl
              border
              bg-white dark:bg-zinc-900
              shadow-sm
              flex flex-col
              items-start
              justify-center
            "
          >
            <p className="text-xs text-muted-foreground">
              {item.label}
            </p>
            <p className="text-sm font-semibold">
              {item.value}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};
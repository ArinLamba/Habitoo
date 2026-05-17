"use client";

import { formatDisplayDate } from "@/lib/date";
import { memo } from "react";

type Props = {
  analytics: {
    stats: {
      habitStartDate: string;
    };
    streaks: {
      currentStreak: number;
      bestStreak: number;
    };
  };
};

export const StatsCards = memo(({ analytics }: Props) => {
  if (!analytics) return null;

  return (
    <div className="grid grid-cols-4 gap-2">
      <Card
        label="Current Streak"
        value={analytics.streaks.currentStreak}
      />

      <Card
        label="Longest Streak"
        value={analytics.streaks.bestStreak}
      />

      <Card
        label="Started on"
        value={formatDisplayDate(analytics.stats.habitStartDate)}
      />
      <Card
        label="Started on"
        value={formatDisplayDate(analytics.stats.habitStartDate)}
      />
    </div>
  );
});

StatsCards.displayName = "StatsCards";

const Card = ({ label, value }: { label: string; value: number | string }) => (
  <div className="px-6 py-1 rounded-md border bg-white shadow-md dark:bg-zinc-900 gap-x-1">
    <p className="text-[12px] text-muted-foreground">{label}</p>
    <p className="text-[12px] font-bold">{value} d</p>
  </div>
);
"use client";

import { memo } from "react";
import {
  ArrowUp,
  ArrowRight,
  CalendarDays,
  Check,
  X,
} from "lucide-react";
import { buildHabitStats } from "@/lib/build-habit-stats";
import { Habit } from "@/lib/types";

type Props = {
  habit: Habit;
  analytics: ReturnType<typeof buildHabitStats>;
};

export const StatsCards = memo(({ habit, analytics }: Props) => {
  if(!analytics) return null;

  const completed = analytics.stats.completedCount;
  const failed = analytics.stats.failedCount;
  const skipped = analytics.stats.skippedCount;
  const loggedDays = analytics.stats.loggedDayCount;
  const total = formatStatNumber(analytics.stats.totalValue);

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-md border border-white/10 bg-zinc-900 md:grid-cols-5">
      <StatCard
        icon={<Check size={14} />}
        label="COMPLETED"
        value={`${completed}d`}
        color="text-blue-400"
      />

      <StatCard
        icon={<X size={14} />}
        label="FAILED"
        value={`${failed}d`}
        color="text-zinc-400"
      />

      <StatCard
        icon={<ArrowRight size={14} />}
        label="SKIPPED"
        value={`${skipped}d`}
        color="text-zinc-400"
      />

      <StatCard
        icon={<CalendarDays size={14} />}
        label="LOGGED"
        value={`${loggedDays}d`}
        color="text-blue-400"
      />

      <StatCard
        icon={<ArrowUp size={14} />}
        label="TOTAL"
        value={`${total} ${habit.unit}`}
        color="text-blue-400"
      />
    </div>
  );
});

StatsCards.displayName = "StatsCards";

const formatStatNumber = (value: number) =>
  Number.isInteger(value) ? value.toString() : value.toFixed(2);

type CardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
};

const StatCard = ({
  icon,
  label,
  value,
  color,
}: CardProps) => {
  return (
    <div className="border-r border-white/10 px-4 py-3 last:border-r-0">
      <div className="flex items-center gap-1 text-[11px] font-semibold tracking-wide text-zinc-300">
        <span className={color}>{icon}</span>
        <span>{label}</span>
      </div>

      <div className="mt-1 flex items-end gap-1">
        <h2 className="text-sm font-bold leading-none text-white">
          {value}
        </h2>

        <span
          className={`text-xs font-medium ${color}`}
        >
          {/* {delta} */}
        </span>
      </div>
    </div>
  );
};

"use client";

import { memo } from "react";
import {
  ArrowUp,
  ArrowRight,
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

  const completed = analytics.calendar.sets.completed.size;
  const failed = analytics.calendar.sets.failed.size;
  const skipped = analytics.calendar.sets.skipped.size;

  const total = analytics.charts.day.reduce(
    (sum, item) => sum + item.value,
    0
  );
  return (
    <div className="grid grid-cols-4 overflow-hidden rounded-md border border-white/10 bg-zinc-900">
      <StatCard
        icon={<Check size={14} />}
        label="COMPLETED"
        value={`${completed}d`}
        color="text-emerald-400"
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
        icon={<ArrowUp size={14} />}
        label="TOTAL"
        value={`${total} ${habit.unit}`}
        color="text-emerald-400"
      />
    </div>
  );
});

StatsCards.displayName = "StatsCards";

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
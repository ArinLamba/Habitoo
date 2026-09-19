"use client";

import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  Flame,
  TrendingUp,
} from "lucide-react";

import { useCompletions } from "@/hooks/queries/use-completions";
import { useHabits } from "@/hooks/queries/use-habits";
import { useStats } from "@/hooks/use-stats";
import { formatDate } from "@/lib/date";
import { getHabitPerformance, getMostActiveDay } from "@/lib/insights";

export const AnalyticsRail = () => {
  const { data: habits = [] } = useHabits();
  const { data: completions = [] } = useCompletions(365);

  const activeHabits = habits.filter((habit) => habit.lifecycle === "active");
  const stats = useStats(activeHabits, completions);

  const today = formatDate(new Date());
  const currentMonth = today.slice(0, 7);
  const monthLogs = completions.filter((completion) =>
    completion.date.startsWith(currentMonth)
  ).length;
  const performance = getHabitPerformance(activeHabits, completions);
  const sortedPerformance = [...performance].sort(
    (a, b) => b.percentage - a.percentage
  );
  const topHabit = sortedPerformance[0];
  const attentionHabit = [...sortedPerformance]
    .reverse()
    .find((habit) => habit.percentage < 100);
  const bestStreakHabit = [...stats.habitStats].sort(
    (a, b) => b.currentStreak - a.currentStreak
  )[0];
  const mostActiveDay = getMostActiveDay(completions);

  return (
    <div className="flex flex-col gap-2.5">
      <section className="rounded-md border border-black/10 bg-zinc-50/80 p-3 dark:border-white/10 dark:bg-zinc-900/70">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Analytics focus
        </p>
        <h2 className="mt-1 text-base font-semibold">What to notice</h2>
      </section>

      <RailCard icon={<CalendarDays />} label="This month">
        <div className="grid grid-cols-2 gap-2">
          <MiniStat label="Logs" value={monthLogs.toString()} />
          <MiniStat label="Consistency" value={`${stats.consistency}%`} />
        </div>
      </RailCard>

      <RailCard icon={<Flame />} label="Momentum">
        <div className="grid grid-cols-2 gap-2">
          <MiniStat label="Current" value={`${stats.currentStreak}d`} />
          <MiniStat label="Best" value={`${stats.bestStreak}d`} />
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {bestStreakHabit
            ? `${bestStreakHabit.name} is carrying the strongest current streak.`
            : "Create a habit to start building momentum."}
        </p>
      </RailCard>

      <RailCard icon={<TrendingUp />} label="Strongest habit">
        <HabitSignal
          emptyText="No habit data yet."
          name={topHabit?.name}
          percentage={topHabit?.percentage}
        />
      </RailCard>

      <RailCard icon={<AlertCircle />} label="Needs attention">
        <HabitSignal
          emptyText="Nothing needs attention yet."
          name={attentionHabit?.name}
          percentage={attentionHabit?.percentage}
        />
      </RailCard>

      <RailCard icon={<BarChart3 />} label="Pattern read">
        <div className="grid grid-cols-2 gap-2">
          <MiniStat
            label="Active day"
            value={mostActiveDay ? mostActiveDay[0].slice(0, 3) : "-"}
          />
          <MiniStat label="Break" value={`${stats.longestBreak}d`} />
        </div>
      </RailCard>
    </div>
  );
};

function RailCard({
  children,
  icon,
  label,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <section className="rounded-md border border-black/10 bg-zinc-50/80 p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900/70">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <span className="text-emerald-500 [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </span>
      </div>
      {children}
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-2.5 dark:bg-zinc-950/70">
      <p className="text-lg font-semibold leading-none">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function HabitSignal({
  emptyText,
  name,
  percentage,
}: {
  emptyText: string;
  name?: string;
  percentage?: number;
}) {
  if (!name || percentage === undefined) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="min-w-0 truncate font-semibold">{name}</p>
        <p className="shrink-0 text-muted-foreground">{percentage}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}


import type React from "react";
import { Activity, CalendarDays, CheckCircle2, Target } from "lucide-react";

import { formatDate } from "@/lib/date";
import { Completion, Habit, HABIT_STATUS } from "@/lib/types";

export const StatsOverview = ({ habits, completions }: {
  habits: Habit[];
  completions: Completion[];
}) => {

  const activeHabits = habits.filter(
    (habit) => habit.lifecycle === "active"
  );
  const today = formatDate(new Date());
  const currentMonth = today.slice(0, 7);
  const total = completions.length;
  const done = completions.filter(c => c.status === HABIT_STATUS.COMPLETED).length;
  const doneToday = new Set(
    completions
      .filter((c) => c.date === today && c.status === HABIT_STATUS.COMPLETED)
      .map((c) => c.habitId)
  ).size;
  const monthLogs = completions.filter((c) =>
    c.date.startsWith(currentMonth)
  ).length;

  const rate = total === 0 ? 0 : Math.round((done / total) * 100);

  const totalDays = new Set(
    completions.map(c => c.date)
  ).size;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        label="Active habits"
        value={`${activeHabits.length}`}
        helper={`${habits.length} total tracked`}
        icon={<Target className="h-4 w-4" />}
      />
      <Card
        label="Done today"
        value={`${doneToday}`}
        helper={`${activeHabits.length} possible`}
        icon={<CheckCircle2 className="h-4 w-4" />}
      />
      <Card
        label="Month logs"
        value={`${monthLogs}`}
        helper="logged this month"
        icon={<Activity className="h-4 w-4" />}
      />
      <Card
        label="Active days"
        value={`${totalDays}`}
        helper={`${rate}% completion signal`}
        icon={<CalendarDays className="h-4 w-4" />}
      />

    </div>
  );
};


type CardProps = {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
};
const Card = ({
  label,
  value,
  helper,
  icon,
}: CardProps) => {
  return (
    <div className="rounded-md border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <span>{label}</span>
        <span className="text-emerald-500">{icon}</span>
      </div>

      <div className="mt-3 flex items-end gap-2">
        <h2 className="text-2xl font-semibold leading-none">
          {value}
        </h2>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {helper}
      </p>
    </div>
  );
};

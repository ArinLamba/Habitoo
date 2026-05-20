"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatDate } from "@/lib/date";
import { Completion, Habit, HABIT_STATUS } from "@/lib/types";

type Props = {
  habits: Habit[];
  completions: Completion[];
};

const monthLabel = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

const getMonthDays = (month: Date) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const last = new Date(year, monthIndex + 1, 0).getDate();

  return Array.from({ length: last }, (_, index) => {
    return new Date(year, monthIndex, index + 1);
  });
};

export const MonthlyTrend = ({
  habits,
  completions,
}: Props) => {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const activeHabitIds = useMemo(() => {
    return new Set(
      habits
        .filter((habit) => habit.lifecycle === "active")
        .map((habit) => habit.id)
    );
  }, [habits]);

  const data = useMemo(() => {
    const completedByDate = new Map<string, Set<string>>();

    completions.forEach((completion) => {
      if (!activeHabitIds.has(completion.habitId)) return;
      if (completion.status !== HABIT_STATUS.COMPLETED) return;

      if (!completedByDate.has(completion.date)) {
        completedByDate.set(completion.date, new Set());
      }

      completedByDate.get(completion.date)!.add(completion.habitId);
    });

    return getMonthDays(month).map((date) => {
      const key = formatDate(date);

      return {
        date: date.getDate().toString(),
        habits: completedByDate.get(key)?.size ?? 0,
      };
    });
  }, [activeHabitIds, completions, month]);

  const total = data.reduce((sum, point) => sum + point.habits, 0);
  const peak = Math.max(...data.map((point) => point.habits), 0);

  const shiftMonth = (amount: number) => {
    setMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + amount,
          1
        )
    );
  };

  return (
    <section className="rounded-md border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Monthly trend
          </p>
          <h2 className="text-lg font-semibold">
            Habits completed per day
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </Button>
          <div className="min-w-36 rounded-md border border-black/10 px-3 py-1.5 text-center text-sm font-medium dark:border-white/10">
            {monthLabel(month)}
          </div>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="mb-3 flex gap-3 text-sm">
        <div className="rounded-md bg-muted/60 px-3 py-2">
          <span className="text-muted-foreground">Total </span>
          <span className="font-semibold">{total}</span>
        </div>
        <div className="rounded-md bg-muted/60 px-3 py-2">
          <span className="text-muted-foreground">Best day </span>
          <span className="font-semibold">{peak}</span>
        </div>
      </div>

      <ChartContainer
        config={{
          habits: {
            label: "Habits",
            color: "#22c55e",
          },
        }}
        className="h-[280px] w-full"
      >
        <AreaChart data={data} margin={{ left: 8, right: 8 }}>
          <defs>
            <linearGradient id="monthlyTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="habits"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#monthlyTrendFill)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
};

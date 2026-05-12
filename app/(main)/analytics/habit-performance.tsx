import { getHabitPerformance } from "@/lib/insights";
import { Completion, Habit } from "@/lib/types";
import { useRangeStore } from "@/store/use-range-store";
import { useMemo } from "react";

export const HabitPerformance = ({
  habits,
  completions,
}: {
  habits: Habit[];
  completions: Completion[];
}) => {

  const { range } = useRangeStore();

  const data = useMemo(() => {
    return getHabitPerformance(habits, completions);
  },[habits, completions]);

  return (
    <div className="p-4 rounded-lg border shadow-md bg-white dark:bg-zinc-900">
      <p className="text-sm text-muted-foreground mb-4">
        📊 Habit Performance
      </p>

      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Based on last {range === "all" ? "all time" : `${range} days`}
        </p>
        {data.map((h, i) => (
          <div key={i}>

            {/* Top row */}
            <div className="flex justify-between text-sm">
              <span>{h.name}</span>
              <span className="text-muted-foreground">
                {h.percentage}%
              </span>
            </div>

            {/* Bar */}
            <div className="w-full h-2 bg-gray-700 rounded mt-1 overflow-hidden">
              <div
                className={`h-full ${getBarColor(h.percentage)} transition-all`}
                style={{ width: `${h.percentage}%` }}
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const getBarColor = (p: number) => {
  if (p < 40) return "bg-red-500";
  if (p < 70) return "bg-yellow-500";
  return "bg-green-500";
};
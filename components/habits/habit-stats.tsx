"use client";

import { useHabitStats } from "@/hooks/use-habit-stats";
import { cn } from "@/lib/utils";

export const HabitStats = () => {
  const stats = useHabitStats();

  if (!stats) return null;

  return (
    <div className="mt-4 space-y-3">
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-2">
        {/* Consistency Card (Calendar Style) */}
        <div
          className={cn(
            "col-span-1 rounded-md border px-3 py-2",
            "bg-muted/40 dark:bg-zinc-900"
          )}
        >
          <p className="text-[10px] text-muted-foreground">
            Consistency
          </p>

          <div className="fle items-end justify-between m">
            <p className="text-lg font-semibold tracking-tight">
              {stats.consistency}%
            </p>
            
            <p className="text-[10px] mt-1 text-muted-foreground">
              Since <span className="text-white">{formatDisplayDate(stats.habitStartDate)}</span>
            </p>
          </div>
        </div>

        {/* Other Cards */}
        <MiniCard label="Last" value={stats.lastDoneText} />
        <MiniCard label="Week" value={`${stats.weekDone}/7`} />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-2">
        <MiniCard label="🔥 Current" value={`${stats.currentStreak}`} />
        <MiniCard label="🏆 Best" value={`${stats.bestStreak}`} />
      </div>

      {/* Insight */}
      <div className="text-xs text-muted-foreground px-1">
        {stats.insight}
      </div>
    </div>
  );
};

const MiniCard = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-md border px-3 py-2 bg-background dark:bg-zinc-900">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
};

const formatDisplayDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("default", {
    day: "numeric",
    month: "short",
  });
};
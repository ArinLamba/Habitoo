"use client";


import { cn } from "@/lib/utils";

export const HabitStats = () => {


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
              78%
            </p>
            
            <p className="text-[10px] mt-1 text-muted-foreground">
              Since <span className="text-white">14</span>
            </p>
          </div>
        </div>

        {/* Other Cards */}
        <MiniCard label="Last" value="14" />
        <MiniCard label="Week" value="5" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-2">
        <MiniCard label="🔥 Current" value="324" />
        <MiniCard label="🏆 Best" value="asdf" />
      </div>

      {/* Insight */}
      <div className="text-xs text-muted-foreground px-1">
        asdf
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
"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { generateHeatmapGrid, getHeatmapData } from "@/lib/helper";

import { useDateStore } from "@/store/use-date-store";
import { useCompletionsStore } from "@/store/use-completions-store";

export const Heatmap = () => {
  const { setCurrentDate } = useDateStore();
  const completions = useCompletionsStore((s) => s.completions);

  const data = getHeatmapData(completions);
  const weeks = generateHeatmapGrid(90);

  return (
    <div className="p-1 dark:bg-zinc-900 inline-block mx-auto">
      
      {/* Title */}
      <p className="text-sm text-muted-foreground mb-3">
        📊 Consistency (Last 90 days)
      </p>

      {/* Month Labels */}
      <div className="flex gap-[5px] mb-1 text-[10px] text-muted-foreground">
        <div className="w-6" /> {/* space for day labels */}

        {weeks.map((week, i) => {
          const currentMonth = new Date(week[0]).getMonth();
          const prevMonth =
            i > 0 ? new Date(weeks[i - 1][0]).getMonth() : null;

          const isNewMonth = currentMonth !== prevMonth;

          return (
            <div
              key={i}
              className={`w-3 text-center ${
                isNewMonth ? "ml-[11px] font-medium" : ""
              }`}
            >
              {isNewMonth
                ? new Date(week[0]).toLocaleString("default", {
                    month: "short",
                  })
                : ""}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex gap-[6px]">
        
        {/* Day labels */}
        <div className="flex flex-col gap-[px] text-[10px] text-muted-foreground mr-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Weeks */}
        {weeks.map((week, i) => {
          const currentMonth = new Date(week[0]).getMonth();
          const prevMonth =
            i > 0 ? new Date(weeks[i - 1][0]).getMonth() : null;

          const isNewMonth = currentMonth !== prevMonth;

          return (
            <div
              key={i}
              className={`flex flex-col gap-[4px] ${
                isNewMonth ? "ml-2" : ""
              }`}
            >
              {week.map((date) => {
                const count = data.get(date) || 0;

                const color =
                  count === 0
                    ? "bg-gray-700"
                    : count < 2
                    ? "bg-green-900"
                    : count < 4
                    ? "bg-green-700"
                    : count < 7 
                    ? "bg-green-500"
                    : "bg-green-300"

                return (
                  <Tooltip key={date}>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => setCurrentDate(new Date(date))}
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125 ${color}`}
                      />
                    </TooltipTrigger>

                    <TooltipContent side="top" className="text-xs px-2 py-1 rounded-md shadow-md pointer-events-none ">
                      <p> {count} habit{count !== 1 && "s"} on </p>
                      <p className="text-muted-foregroun"> {date} </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 bg-gray-700 rounded-sm" />
        <div className="w-3 h-3 bg-green-900 rounded-sm" />
        <div className="w-3 h-3 bg-green-700 rounded-sm" />
        <div className="w-3 h-3 bg-green-500 rounded-sm" />
        <div className="w-3 h-3 bg-green-300 rounded-sm" />
        <span>More</span>
      </div>
    </div>
  );
};
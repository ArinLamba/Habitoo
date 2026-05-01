
import { Completion } from "@/lib/types";
import { getLongestBreak, getMostActiveDay, getSmartInsight } from "@/lib/insights";
import { useMemo } from "react";

export const SmartInsight = ({ completions }: {
  completions: Completion[];
}) => {


  const { insight, longestBreak, mostActive } = useMemo(() => {
    const dates = completions
      .filter(c => c.completed)
      .map(c => c.date);

    return {
      insight: getSmartInsight(completions),
      longestBreak: getLongestBreak(dates),
      mostActive: getMostActiveDay(completions),
    };
  }, [completions]);

  const [day, count] = mostActive || [];

  return (
    <div className="p-4 rounded-lg border shadow-md bg-white dark:bg-zinc-900">
      <p className="text-sm text-muted-foreground mb-3">
        🧠 Smart Insight
      </p>

      <div className="flex flex-col gap-2 text-sm">
        <p>💡 {insight}</p>

        <p>
          😴 Longest break: <span className="font-medium">{longestBreak} days</span>
        </p>

        <p>
          🔥 Most active:{" "}
          <span className="font-medium">
            {day ? `${day} (${count})` : "No data"}
          </span>
        </p>

      </div>
    </div>
  );
};
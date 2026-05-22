import { useMemo } from "react";

import { Completion, HABIT_STATUS } from "@/lib/types";
import {
  getLongestBreak,
  getMostActiveDay,
  getSmartInsight,
} from "@/lib/insights";

export const SmartInsight = ({
  completions,
}: {
  completions: Completion[];
}) => {
  const { insight, longestBreak, mostActive } = useMemo(() => {
    const dates = completions
      .filter((completion) => completion.status === HABIT_STATUS.COMPLETED)
      .map((completion) => completion.date);

    return {
      insight: getSmartInsight(completions),
      longestBreak: getLongestBreak(dates),
      mostActive: getMostActiveDay(completions),
    };
  }, [completions]);

  const [day, count] = mostActive || [];

  return (
    <div className="rounded-md border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Pattern read
      </p>

      <p className="mt-4 text-sm font-medium">
        {insight}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-muted/60 p-3">
          <p className="text-xs text-muted-foreground">
            Longest break
          </p>
          <p className="mt-1 font-semibold">{longestBreak} days</p>
        </div>
        <div className="rounded-md bg-muted/60 p-3">
          <p className="text-xs text-muted-foreground">
            Most active
          </p>
          <p className="mt-1 font-semibold">
            {day ? `${day} (${count})` : "No data"}
          </p>
        </div>
      </div>
    </div>
  );
};

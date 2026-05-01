
import { CircularProgress } from "./circular-progress";
import Link from "next/link";

import { Completion, Habit } from "@/lib/types";
import { useStats } from "@/hooks/use-stats";

type Props = {
  habits: Habit[];
  completions: Completion[];
};

export const AnalysisBoard = ({
  habits,
  completions,
}: Props) => {

  const { currentStreak, bestStreak, consistency } = useStats(habits, completions);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 dark:bg-zinc-900 bg-white dark:border-white/10 rounded-md dark:border py-5 px-3 shadow-md">

      <CircularProgress habits={habits} completions={completions}/>

      <div className="flex lg:flex-col lg:gap-y-3 gap-x-8 my-auto">

        <div>
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="text-lg font-semibold">
            🔥 {currentStreak} days
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Best</p>
          <p className="text-sm font-medium">
            🏆 {bestStreak} days
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Consistency</p>
          <p className="text-sm">{consistency}%</p>
        </div>
      </div>

      <div className="absolute right-0 top-2 mr-3 lg:static">
        <Link
          href="/stats"
          className="text-xs px-3 py-1.5 rounded-md border hover:bg-muted transition"
        >
          View stats →
        </Link>
      </div>
    </div>
  );
};
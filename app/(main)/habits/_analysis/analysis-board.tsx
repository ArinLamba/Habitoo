import { Completion, Habit } from "@/lib/types";
import { CircularProgress } from "./circular-progress";
import Link from "next/link";
import { getStreaks } from "@/lib/helper";
import { formatDate } from "@/lib/helper";

type Props = {
  habits: Habit[];
  completions: Completion[];
};

export const AnalysisBoard = ({ 
  habits,
  completions,
 }: Props) => {

  const { currentStreak, bestStreak } = getStreaks(completions);
  const normalize = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const today = normalize(new Date());
  const todayStr = formatDate(today);

  // ✅ DONE SET (safe)
  const doneSet = new Set(
    completions
      .filter(c => c.completed)
      .filter(c => c.date <= todayStr) // 🚫 no future
      .map(c => `${c.habitId}-${c.date}`)
  );

  // ✅ TOTAL POSSIBLE DAYS (safe)
  let totalDays = 0;

  habits.forEach(habit => {
    if (!habit.createdAt) return;

    const created = normalize(new Date(habit.createdAt));

    if (isNaN(created.getTime())) return; // 🚫 skip broken data

    const diff =
      Math.floor(
        (today.getTime() - created.getTime()) /
        (1000 * 60 * 60 * 24)
      ) + 1;

    if (diff > 0) {
      totalDays += diff;
    }
  });

  // ✅ FINAL (guarded)
  const consistency =
    totalDays > 0
      ? Math.min(100, Math.round((doneSet.size / totalDays) * 100))
      : 0;
  
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 dark:bg-zinc-900 bg-white  dark:border-white/10 rounded-md dark:border py-5 px-3 shadow-md transition-all duration-500 relative">
  
      <CircularProgress 
        habits={habits}
        completions={completions}
      />
      {/* MINI STATS */}
      <div className="flex lg:flex-col lg:gap-y-3  gap-x-8 my-auto">
        
        <div >
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
      <div className="absolute right-0 top-2 mr-3 lg:static ">
        <Link
          href="/stats"
          className="
          text-xs px-3 py-1.5 rounded-md border
            hover:bg-muted hover:text-primary
            transition
            "
            >
          View stats →
        </Link>
      </div>
    </div>
  );
};
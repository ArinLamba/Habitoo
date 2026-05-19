import { Completion, Habit } from "@/lib/types";
import { HabitCard } from "./habit-card";
import { useStats } from "@/hooks/use-stats"
import { useDateStore } from "@/store/use-date-store";
import { formatDate } from "@/lib/date";
import { AddHabitInput } from "../add-habit-input";
import { cn } from "@/lib/utils";

type Props = {
  habits: Habit[];
  completions: Completion[];
};

export const HabitStackView = ({
  habits,
  completions
}: Props) => {

  const { statusMap, habitStatsMap } = useStats(habits, completions);
  const { currentDate, setCurrentDate } = useDateStore();
  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    return date;
  });

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
      <div className="flex-1 overflow-y-auto pb-24">
      {habits.map((habit) => {
        const currentHabit = habitStatsMap.get(habit.id);
        return (
            <HabitCard
              key={habit.id}
              habit={habit}
              completions={completions}
              statusMap={statusMap}
              currentStreak={currentHabit?.currentStreak ?? 0}
              longestStreak={currentHabit?.bestStreak ?? 0}
            />
        )
      })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-2 overflow-x-auto scrollbar-none">
            {days.map((day) => {
              const selected =
                formatDate(day) === formatDate(currentDate);

              return (
                <button
                  key={formatDate(day)}
                  onClick={() => setCurrentDate(day)}
                  className={cn(
                    "flex min-w-12 flex-col items-center rounded-md px-2 py-1 text-xs text-muted-foreground",
                    selected &&
                      "bg-muted text-foreground shadow-sm"
                  )}
                >
                  <span className="font-medium">
                    {day.toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                  <span className="text-base font-bold">
                    {day.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
          <AddHabitInput variant="icon" />
        </div>
      </div>
    </div>
  );
};


import { formatDate, getIsFuture, getToday } from "@/lib/date";
import { Habit, HABIT_STATUS, HabitStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useDateStore } from "@/store/use-date-store";
import { BookOpen } from "lucide-react";

type Props = {
  habit: Habit;
  completionMap: Map<string, HabitStatus>;
  currentStreak: number;
  longestStreak: number;
};

export const HabitCard = ({
  habit,
  completionMap,
  currentStreak,
  longestStreak,
}: Props) => {

  const { currentDate } = useDateStore();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from(
    { length: daysInMonth },
    (_, i) => {
      const day = i + 1;

      return {
        day,
        dateObj: new Date(year, month, day),
      };
    }
  );

  return (
    <div className="shadow-lg border rounded-md space-y-3 bg-white dark:bg-zinc-900 p-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">

          <div className=" bg-green-600/10 flex items-center justify-center rounded-full h-9 w-9">
            <BookOpen fill="#1CB51C" stroke="" size={24}/>
          </div>

          <div>
            <h1 className="text-sm font-semibold tracking-tight">{habit.name}</h1>
            <p className="text-xs text-muted-foreground">Habit Goal or Description</p>
          </div>
        </div>

        <div className="bg-amber-500/5 rounded p-2 ">
          <h1 className="text-xs">🔥 Current Streak: {currentStreak} days</h1>
          <p className="text-xs text-muted-foreground">🏆 Longest Streak: {longestStreak} days</p>
        </div>
      </div>

      <div className="flex overflow-x-auto">
        {days.map(({ day, dateObj }) => {
          const date = formatDate(dateObj);
          const status = completionMap.get(`${habit.id}-${date}`);

          const completed = status === HABIT_STATUS.COMPLETED;
          const isFuture = getIsFuture(date);
          const isToday = getToday() === date;

          return (
            <div
              key={day}
              className="flex flex-col items-center gap-2 bg-amer-600"
            >
              <button className={cn(
                isToday && "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 ",
                "text-xs h-7 w-7 flex items-center justify-center rounded-full",
              )}>
                {day}
              </button>

              <div
                className={cn(
                  "h-5 w-5 rounded-full border border-zinc-400 ",
                  completed && "bg-emerald-500 border-green-500",
                  isFuture && "border-dashed border border-rose-400"
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 ml-1 mt-6">
        <div className="flex gap-2  items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
        </div>
        <div className="flex gap-2  items-center justify-center">
          <div className="h-3 w-3 rounded-full border border-zinc-400" />
          <p className="text-xs text-muted-foreground mt-0.5">Not Done</p>
        </div>
        <div className="flex gap-2  items-center justify-center">
          <div className="h-3 w-3 rounded-full border-dashed border border-rose-400" />
          <p className="text-xs text-muted-foreground mt-0.5">Future</p>
        </div>
      </div>

    </div>
  );
};
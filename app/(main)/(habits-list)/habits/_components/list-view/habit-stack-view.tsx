import { Completion, Habit } from "@/lib/types";
import { HabitCard } from "./habit-card";
import { useStats } from "@/hooks/use-stats"
import { useDateStore } from "@/store/use-date-store";
import { formatDate } from "@/lib/date";
import { calculateHabitProgress } from "@/lib/habits/progress";
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
  const selectedDate = formatDate(currentDate);
  const activeHabits = habits.filter((habit) => habit.lifecycle === "active");
  const completedHabits = habits.filter((habit) => habit.lifecycle === "completed");
  const archivedHabits = habits.filter((habit) => habit.lifecycle === "archived");
  const groupedHabits = (["day", "week", "month", "year"] as const).map(
    (frequency) => ({
      frequency,
      habits: activeHabits.filter((habit) => {
        const progress = calculateHabitProgress(
          habit,
          completions,
          selectedDate
        );

        return habit.frequency === frequency && !progress.completed;
      }),
    })
  );
  const doneHabits = activeHabits.filter((habit) => {
    return calculateHabitProgress(
      habit,
      completions,
      selectedDate
    ).completed;
  });
  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    return date;
  });

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
      <div className="flex-1 overflow-y-auto px-2 pb-24 pt-2 sm:px-3">
        {groupedHabits.map(({ frequency, habits }) => {
          if (!habits.length) return null;

          return (
            <section key={frequency} className="mb-3 overflow-hidden rounded-md border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:border-white/10">
                <span>{frequency === "day" ? "Daily" : frequency === "week" ? "Weekly" : frequency === "month" ? "Monthly" : "Yearly"}</span>
                <span>{habits.length}</span>
              </div>
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
            </section>
          );
        })}

        {doneHabits.length > 0 && (
          <section className="mb-3 overflow-hidden rounded-md border border-emerald-500/20 bg-emerald-500/[0.04] shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-500/20 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              <span>Success today</span>
              <span>{doneHabits.length}</span>
            </div>
            {doneHabits.map((habit) => {
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
          </section>
        )}

        {[
          { title: "Ended habits", habits: completedHabits },
          { title: "Archived habits", habits: archivedHabits },
        ].map((section) => {
          if (!section.habits.length) return null;

          return (
            <section
              key={section.title}
              className="mb-3 overflow-hidden rounded-md border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between border-b border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:border-white/10">
                <span>{section.title}</span>
                <span>{section.habits.length}</span>
              </div>
              {section.habits.map((habit) => {
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
                );
              })}
            </section>
          );
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

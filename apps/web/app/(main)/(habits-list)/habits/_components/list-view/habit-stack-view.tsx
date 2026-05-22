"use client";

import { useStats } from "@/hooks/use-stats";
import { useDateStore } from "@/store/use-date-store";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { Completion, Habit } from "@/lib/types";
import { calculateHabitProgress } from "@/lib/habits/progress";

import { HabitCard } from "./habit-card";
import { HabitSection } from "./habit-section-collapsible";
import { AddHabitInput } from "../add-habit-input";

type Props = {
  habits: Habit[];
  completions: Completion[];
};

const getFrequencyTitle = (frequency: Habit["frequency"]) => {
  switch (frequency) {
    case "day":
      return "Daily";
    case "week":
      return "Weekly";
    case "month":
      return "Monthly";
    case "year":
      return "Yearly";
    default:
      return "Habits";
  }
};

export const HabitStackView = ({
  habits,
  completions,
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

  const renderHabitCards = (items: Habit[]) => {
    return items.map((habit) => {
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
    });
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
      <div className="flex-1 overflow-y-auto pb-24 pt-2">
        {groupedHabits.map(({ frequency, habits }) => {
          if (!habits.length) return null;

          return (
            <HabitSection
              key={frequency}
              title={getFrequencyTitle(frequency)}
              count={habits.length}
            >
              {renderHabitCards(habits)}
            </HabitSection>
          );
        })}

        {doneHabits.length > 0 && (
          <HabitSection
            title="Success Today"
            count={doneHabits.length}
            variant="success"
            
          >
            {renderHabitCards(doneHabits)}
          </HabitSection>
        )}

        {completedHabits.length > 0 && (
          <HabitSection
            title="Ended habits"
            count={completedHabits.length}
            defaultOpen={false}
          >
            {renderHabitCards(completedHabits)}
          </HabitSection>
        )}

        {archivedHabits.length > 0 && (
          <HabitSection
            title="Archived habits"
            count={archivedHabits.length}
            defaultOpen={false}
          >
            {renderHabitCards(archivedHabits)}
          </HabitSection>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95">
        <div className="flex items-center gap-3">
          <div className="flex flex-row-reverse flex-1 gap-2 overflow-x-auto scrollbar-none">
            {[...days].reverse().map((day) => {
              const selected =
                formatDate(day) === formatDate(currentDate);

              return (
                <button
                  key={formatDate(day)}
                  onClick={() => setCurrentDate(day)}
                  className={cn(
                    "flex min-w-12 flex-col items-center rounded-md px-2 py-1 text-xs text-muted-foreground",
                    selected && "bg-muted text-foreground shadow-sm"
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
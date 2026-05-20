import { Habit, HabitStatus, Completion } from "@/lib/types";
import { HabitRow } from "./habit-row";
import { HabitGridHeader } from "./habit-grid-header";
import { AddHabitInput } from "../add-habit-input";
import { LifecycleSection } from "../habit-life-cycle";


type TempHabitStats = {
  habitId: string;
  name: string;
  currentStreak: number;
  bestStreak: number;
};


type Props = {
  habits: Habit[];
  completions: Completion[];
  statusMap: Map<string, HabitStatus>;
  habitStatsMap: Map<string, TempHabitStats>;
};

const frequencyLabels = {
  day: "Daily habits",
  week: "Weekly habits",
  month: "Monthly habits",
  year: "Yearly habits",
} as const;

export const HabitGridView = ({
  habits,
  completions,
  statusMap,
  habitStatsMap
}: Props) => {
  const activeHabits = habits.filter(
    (habit) => habit.lifecycle === "active"
  );
  const completedHabits = habits.filter(
    (habit) => habit.lifecycle === "completed"
  );
  const archivedHabits = habits.filter(
    (habit) => habit.lifecycle === "archived"
  );
  const activeByFrequency = (["day", "week", "month", "year"] as const).map(
    (frequency) => ({
      frequency,
      habits: activeHabits.filter((habit) => habit.frequency === frequency),
    })
  );

  return (
    <div className="flex flex-col">
      <HabitGridHeader />
      {activeByFrequency.map(({ frequency, habits }) => {
        if (!habits.length) return null;

        return (
          <section key={frequency}>
            <div className="border-b border-black/10 bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:border-white/10">
              {frequencyLabels[frequency]} ({habits.length})
            </div>
            {habits.map(habit => {
              const stats = habitStatsMap.get(habit.id);
              return (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  completions={completions}
                  statusMap={statusMap}
                  streak={stats?.currentStreak ?? 0}
                />
              )
            })}
          </section>
        );
      })}
      <AddHabitInput />
      <LifecycleSection
        title="Ended habits"
        habits={completedHabits}
      />
      <LifecycleSection
        title="Archived habits"
        habits={archivedHabits}
      />
    </div>
  );
};

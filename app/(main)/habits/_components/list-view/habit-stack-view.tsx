import { Completion, Habit } from "@/lib/types";
import { HabitCard } from "./habit-card";
import { useStats } from "@/hooks/use-stats";

type Props = {
  habits: Habit[];
  completions: Completion[];
};

export const HabitStackView = ({
  habits,
  completions
}: Props) => {

  const { statusMap, habitStatsMap } = useStats(habits, completions);

  return (
    <div>
      {habits.map((habit) => {
        const currentHabit = habitStatsMap.get(habit.id);
        return (
          <div key={habit.id} className="mb-4">
            <HabitCard 
              habit={habit}
              statusMap={statusMap}
              currentStreak={currentHabit?.currentStreak ?? 0}
              longestStreak={currentHabit?.bestStreak ?? 0}
            />
          </div>
        )
      })}
    </div>
  );
};
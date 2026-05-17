import { Habit, HabitStatus } from "@/lib/types";
import { HabitRow } from "./habit-row";
import { HabitGridHeader } from "./habit-grid-header";
import { AddHabitInput } from "../add-habit-input";

type TempHabitStats = {
  habitId: string;
  name: string;
  currentStreak: number;
  bestStreak: number;
};

type Props = {
  habits: Habit[];
  statusMap: Map<string, HabitStatus>;
  habitStatsMap: Map<string, TempHabitStats>;
};

export const HabitGridView = ({
  habits,
  statusMap,
  habitStatsMap
}: Props) => {
  return (
    <div className="h-[calc(100vh-65px)] flex flex-col">
      <HabitGridHeader />
      {habits.map(habit => {
        const stats = habitStatsMap.get(habit.id);
        return (
          <HabitRow
            key={habit.id}
            habit={habit}
            statusMap={statusMap}
            streak={stats?.currentStreak ?? 0}
          />
        )
      })}
      <AddHabitInput />
    </div>
  );
};
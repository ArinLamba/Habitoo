

import { formatDate } from "@/lib/date";

import { Habit, HabitStatus } from "@/lib/types";

import { useDateStore } from "@/store/use-date-store";


import { HabitCalendarCell } from "./habit-card-cell";
import { HabitCardFooter } from "./habit-card-footer";
import { HabitCardHeader } from "./habit-card-header";
import { useHabitActions } from "@/hooks/use-habit-actions";
import { useSelectedCellStore } from "@/store/use-selected-cell-store";

type Props = {
  habit: Habit;
  statusMap: Map<string, HabitStatus>;
  currentStreak: number;
  longestStreak: number;
};

export const HabitCard = ({
  habit,
  statusMap,
  currentStreak,
  longestStreak,
}: Props) => {

  
  const { currentDate, setCurrentDate } = useDateStore();
  const { color, startDate } = habit;
  
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
  const setSelectedCell = useSelectedCellStore(
      (state) => state.setSelectedCell
    );
  const { toggle } = useHabitActions({
    statusMap
  })



  if(!habit) return null;
  

  return (
    <div className="shadow-lg border rounded-md space-y-3 bg-white dark:bg-zinc-900 p-3">
      <HabitCardHeader 
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        habit={habit}
      />

      <div className="flex overflow-x-auto scrollbar scrollbar-thumb-zinc-700/50 scrollbar-h-1 scrollbar-hover:bg-zinc-600 ">
        {days.map(({ day, dateObj }) => {
          const date = formatDate(dateObj);

          return (
            <HabitCalendarCell
              key={day}
              dateObj={dateObj}
              habitId={habit.id}
              startDate={startDate}
              color={color!}
              setSelectedCell={setSelectedCell}
              status={statusMap.get(
                `${habit.id}-${date}`
              )}
              onSelectDate={setCurrentDate}
              toggle={toggle}
            />
          );
        })}
      </div>

      <HabitCardFooter />

    </div>
  );
};
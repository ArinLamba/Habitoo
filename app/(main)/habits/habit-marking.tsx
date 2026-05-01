
import { Header } from "./_components/header";
import { TickBox } from "./_components/tick-box";

import { Completion, Habit } from "@/lib/types";

type Props = {
  habits: Habit[];
  completions: Completion[];
  year: number;
  month: number;
  perfectDaysSet: Set<string>; // 👈 ADD
};

export const HabitMarking = ({
  habits,
  completions,
  year,
  month,
  perfectDaysSet,
}: Props) => {

  if (!habits.length) return null;

  return (
    <div className="ml-3 overflow-x-auto scrollbar-thin">
      <Header perfectDaysSet={perfectDaysSet} />

      {habits.map((habit) => (
        <TickBox
          key={habit.id}
          habit={habit}
          completions={completions}
          year={year}
          month={month}
        />
      ))}
    </div>
  );
};
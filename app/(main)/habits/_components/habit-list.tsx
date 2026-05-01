"use client";

import { MoveLeftIcon, MoveRightIcon } from "lucide-react";

import { HabitItem } from "../_components/habit-item";
import { AddHabitInput } from "../_components/add-habit-input";
import { Button } from "@/components/ui/button";

import { useDateStore } from "@/store/use-date-store";

import { Completion, Habit } from "@/lib/types";
import { useStats } from "@/hooks/use-stats";


type Props = {
  habits: Habit[];
  completions: Completion[];
  year: number;
  month: number;
};

export const HabitList = ({
  habits,
  completions,
  year,
  month,
}: Props) => {

  const { currentDate, setCurrentDate } = useDateStore();

  const stats = useStats(habits, completions);
  
  
  const monthName = currentDate.toLocaleString("default", { month: "long",});

  const prevMonth = () => {
    const newDate = new Date(year, month, 0); // 👈 magic
    setCurrentDate(newDate);
  };
  
  return (
    <div className=" flex no-scrollbar overflow-x-auto flex-col gap-y-1 border-r-white/30 mr-2 ">
      <div className="flex  items-center justify-center mb-3 gap-5">
        <Button variant={"secondary"} onClick={prevMonth}>
          <MoveLeftIcon />
        </Button >

        <h2 className="text-lg shrink-0 font-semibold">
          {monthName} {year}
        </h2>

        <Button variant={"secondary"} onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
          <MoveRightIcon />
        </Button >
      </div>
      
      {habits
        .filter((h) => h && h.id) // 👈 prevents crash
        .map((habit) => {
          const currentHabit = stats.habitStatsMap.get(habit.id);
          return (
          <HabitItem
            key={habit.id}
            habit={habit}
            currentStreak={currentHabit?.currentStreak ?? 0}
          />
        )
})}

      <AddHabitInput />
    </div>
  );
};
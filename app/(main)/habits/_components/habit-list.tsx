"use client";

import { HabitItem } from "../_components/habit-item";
import { AddHabitInput } from "../_components/add-habit-input";
import { Habit } from "@/lib/types";


type Props = {
  habits: Habit[];
};

export const HabitList = ({
  habits,

}: Props) => {


  
  return (
    <div className="flex flex-col gap-y-1 pt-3">
      <div className="bg-blue-500/5 mr-3 mb-2.5 py-7.25 text-center rounded">
        <h3 className="text-blue-400 font-semibold tracking-wide ">All Habits </h3>
      </div>

      <div className="flex no-scrollbar overflow-x-auto flex-col gap-y-[2.17px] border-r-white/30 mr-2">
        {habits
          .filter((h) => h && h.id) // 👈 prevents crash
          .map((habit) => {
            return (
            <HabitItem
              key={habit.id}
              habit={habit}
            />
          )
        })}
      </div>
      <div className="flex items-center bg-aber-200 justify-center p-2 text-xs">
        <AddHabitInput />
      </div>
    </div>
  );
};
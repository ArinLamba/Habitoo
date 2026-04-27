"use client";


import { HabitItem } from "./habit-item";
import { AddHabitInput } from "./add-habit-input";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { useDateStore } from "@/store/use-date-store";
import { Button } from "@/components/ui/button";
import { useHabitStore } from "@/store/use-habit-store";
import { useCompletionsStore } from "@/store/use-completions-store";



export const HabitList = () => {

  const { currentDate, setCurrentDate } = useDateStore();
  const habits = useHabitStore((s) => s.habits);
  const completions = useCompletionsStore((s) => s.completions);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based
  
  const monthName = currentDate.toLocaleString("default", { month: "long",});

  return (
    <div className=" flex no-scrollbar overflow-x-auto flex-col gap-y-1 border-r-white/30 mr-2 ">
      <div className="flex  items-center justify-center mb-3 gap-5">
        <Button variant={"secondary"} onClick={() => setCurrentDate(new Date(year, month - 1, currentDate.getDate()))}>
          <MoveLeftIcon />
        </Button >

        <h2 className="text-lg shrink-0 font-semibold">
          {monthName} {year}
        </h2>

        <Button variant={"secondary"} onClick={() => setCurrentDate(new Date(year, month + 1, currentDate.getDate()))}>
          <MoveRightIcon />
        </Button >
      </div>
      
      {habits
        .filter((h) => h && h.id) // 👈 prevents crash
        .map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            completions={completions}
          />
      ))}

      <AddHabitInput />
    </div>
  );
};
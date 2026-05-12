"use client";
import { useEffect } from "react";

import { MonthDates } from "./_components/month-dates";
import { TickBox } from "./_components/tick-box";

import { Habit, HABIT_STATUS, HabitStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";

import { useDateStore } from "@/store/use-date-store";
import { useSelectedCellStore } from "@/store/use-selected-cell-store";

import { useHabitActions } from "@/hooks/use-habit-actions";

type Props = {
  habits: Habit[];
  year: number;
  month: number;
  perfectDaysSet: Set<string>; // 👈 ADD
  completionMap: Map<string, HabitStatus>;
};

export const HabitMarking = ({
  habits,
  year,
  month,
  perfectDaysSet,
  completionMap
}: Props) => {

  // const { habitViewLayout, setHabitViewLayout } = usehabitViewLayoutStore();
  const { currentDate, setCurrentDate } = useDateStore();
  const { toggle, clear } = useHabitActions({ completionMap });

  const monthName = currentDate.toLocaleString("default", { month: "long",});
  const selectedCell = useSelectedCellStore(s => s.selectedCell);
  const habitId = selectedCell?.habitId;
  const date = selectedCell?.date;


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      const isShortcut =
        (e.altKey && ["d", "s", "f"].includes(key)) ||
        key === "delete";

      if (!isShortcut) return;

      e.preventDefault();

      if (!habitId || !date) return;

      if (e.altKey && key === "d") {
        toggle(habitId, date, HABIT_STATUS.COMPLETED);
      }

      if (e.altKey && key === "s") {
        toggle(habitId, date, HABIT_STATUS.SKIPPED);
      }

      if (e.altKey && key === "f") {
        toggle(habitId, date, HABIT_STATUS.FAILED);
      }

      if (key === "delete") {
        clear(habitId, date);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [habitId, date, toggle, clear]);

  const prevMonth = () => {
    const newDate = new Date(year, month, 0); // 👈 magic
    setCurrentDate(newDate);
  };
  if (!habits.length) return null;

  return (
    <div className="">
      <div className="flex items-center justify-center mb-2 gap-x-6 ">
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
    
      <div className="ml-3 overflow-x-auto scrollbar-thin">

        <MonthDates perfectDaysSet={perfectDaysSet} />
        {habits.map((habit) => (
          <TickBox
            key={habit.id}
            habit={habit}
            year={year}
            month={month}
            completionMap={completionMap}
          />
        ))}
      </div>
      
    </div>
  );
};
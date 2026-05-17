"use client";

import { Flame } from "lucide-react";

import { memo, useMemo } from "react";

import { Habit, HABIT_STATUS, HabitStatus } from "@/lib/types";

import { getLast14Days } from "@/lib/helper";

import { DayCell } from "./day-cell";
import { CELL_VARIANTS } from "@/lib/variants";

import { useHabitActions } from "@/hooks/use-habit-actions";

import { useSelectedCellStore } from "@/store/use-selected-cell-store";
import { getIsFuture } from "@/lib/date";

import { HabitActions } from "../habit-actions";
import { ICON_MAP, HabitIconName } from "@/lib/habit-icons";
import Link from "next/link";


type Props = {
  habit: Habit;
  statusMap: Map<string, HabitStatus>;
  streak: number;
};

export const HabitRow = memo(({
  habit,
  statusMap,
  streak
}: Props) => {
  
  const days = useMemo(() => getLast14Days(), []);
  // const stats = useMemo(() => buildHabitStats(habit), []);

  const IconComponent = (ICON_MAP[habit.icon as HabitIconName] ) || ICON_MAP.QuestionMark;


  const { toggle } = useHabitActions({
    statusMap,
  });

  const setSelectedCell = useSelectedCellStore(
    (state) => state.setSelectedCell
  );

  return (
    <div className="flex items-stretch border-b border-black/10 dark:border-white/10 ">

      {/* LEFT */}
      <div className="w-[250px] ">
        <div className="flex w-[250px] ">
          <Link href={`habits/${habit.id}`} className="flex flex-1 items-center justify-center pl-3 gap-x-2 hover:scale-105 transition-transform">
            <div className="shrink-0">
              <IconComponent
                size={20}
                color={habit.color!}
                />
            </div>

            <div className="truncate text-sm font-medium w-full">
              {habit.name}
            </div>
          </Link>
          <HabitActions habit={habit}/>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-0.5 bg-black/10 dark:bg-white/10" />
      
      {/* RIGHT */}
      <div className="flex flex- flex-row-reverse overflow-hidden">

        {/* STREAK */}
        <div className="w-12 shrink-0 flex items-center justify-center border-l border-black/10 dark:border-white/10 text-amber-600 text-sm font-semibold">
          <div className="flex items-center gap-x-1">
            <Flame
              size={16}
              fill="orange"
              stroke="orange"
            />
            <p>{streak}</p>
          </div>
        </div>

        {/* DAYS */}
        <div className="flex flex-row-reverse min-w-0  overflow-hidden">
          {[...days].reverse().map((day) => {

            const isBeforeStart = habit.startDate > day.date;
            const isFuture = getIsFuture(day.date);
            const isDisabled = isBeforeStart || isFuture;

            const key = `${habit.id}-${day.date}`;

            const status =
              statusMap.get(key) ?? null;

            const isDone =
              status === HABIT_STATUS.COMPLETED;

            const isSkipped =
              status === HABIT_STATUS.SKIPPED;

            const isFailed =
              status === HABIT_STATUS.FAILED;

            let variant = CELL_VARIANTS.default;

            if (isBeforeStart) {
              variant = CELL_VARIANTS.beforeStart;
            } else if (isFuture) {
              variant = CELL_VARIANTS.future;
            } else if (isDone) {
              variant = CELL_VARIANTS.completed;
            } else if (isSkipped) {
              variant = CELL_VARIANTS.skipped;
            } else if (isFailed) {
              variant = CELL_VARIANTS.failed;
            }

            return (
              <DayCell
                key={day.date}
                habitId={habit.id}
                date={day.date}
                status={status}
                color={habit.color!}
                isDisabled={isDisabled}
                isFuture={isFuture}
                variant={variant}
                isBeforeStart={isBeforeStart}
                setSelectedCell={setSelectedCell}
                toggle={toggle}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

HabitRow.displayName = "HabitRow";
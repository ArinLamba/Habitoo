"use client";

import { memo, useMemo } from "react";

import { Habit, HABIT_STATUS, HabitStatus } from "@/lib/types";

import { normalize, formatDate, getIsFuture } from "@/lib/date";

import { useHabitActions } from "@/hooks/use-habit-actions";

import { useSelectedCellStore } from "@/store/use-selected-cell-store";

import { DayCell } from "./day-cell";

import { CELL_VARIANTS } from "@/lib/variants";

type Props = {
  habit: Habit;
  year: number;
  month: number;
  completionMap: Map<string, HabitStatus>;
};

const createCompletionKey = (
  habitId: string,
  date: string
) => {
  return `${habitId}-${date}`;
};

export const TickBox = memo(
  ({
    habit,
    year,
    month,
    completionMap,
  }: Props) => {
    const { id, startDate, color } = habit;

    const setSelectedCell = useSelectedCellStore(
      (state) => state.setSelectedCell
    );

    const { toggle } = useHabitActions({
      completionMap,
    });

    const daysInMonth = useMemo(() => {
      return new Date(
        year,
        month + 1,
        0
      ).getDate();
    }, [year, month]);

    const days = useMemo(() => {
      return Array.from(
        { length: daysInMonth },
        (_, index) => index + 1
      );
    }, [daysInMonth]);

    const created = useMemo(() => {
      return normalize(new Date(startDate));
    }, [startDate]);

    return (
      <div className="grid grid-cols-[repeat(31,minmax(0,1fr))] gap-x-[40.5px] ">
        {days.map((day) => {
          const dateObj = new Date(
            year,
            month,
            day
          );

          const normalizedDate =
            normalize(dateObj);

          const date = formatDate(dateObj);

          const completionKey =
            createCompletionKey(id, date);

          const status =
            completionMap.get(completionKey) ??
            null;

          const isDone =
            status === HABIT_STATUS.COMPLETED;

          const isSkipped =
            status === HABIT_STATUS.SKIPPED;

          const isFailed =
            status === HABIT_STATUS.FAILED;

          const isBeforeStart =
            normalizedDate < created;

          const future = getIsFuture(date);

          const isDisabled =
            isBeforeStart || future;

          let variant = CELL_VARIANTS.default;

          if (isBeforeStart) {
            variant = CELL_VARIANTS.beforeStart;
          } else if (future) {
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
              key={day}
              habitId={id}
              date={date}
              status={status}
              color={color!}
              isDisabled={isDisabled}
              isFuture={future}
              variant={variant}
              setSelectedCell={setSelectedCell}
              toggle={toggle}
              isBeforeStart={isBeforeStart}
            />
          );
        })}
      </div>
    );
  }
);

TickBox.displayName = "TickBox";
"use client";

import { getIsFuture } from "@/lib/date";

import {
  Completion,
  Habit,
  HABIT_STATUS,
  HabitStatus,
} from "@/lib/types";

import { CELL_VARIANTS } from "@/lib/variants";
import { calculateHabitProgress } from "@/lib/habits/progress";

import { DayCell } from "./day-cell";

import { useHabitActions } from "@/hooks/use-habit-actions";
import { useAddLog } from "@/hooks/mutations/use-add-log";
import { useVisibleDays } from "@/hooks/use-visible-days";

import { useSelectedCellStore } from "@/store/use-selected-cell-store";

type Props = {
  habit: Habit;
  completions: Completion[];
  statusMap: Map<string, HabitStatus>;
};

export const DailyHabitGrid = ({
  habit,
  completions,
  statusMap,
}: Props) => {

  const days = useVisibleDays();

  const { toggle } =
    useHabitActions({
      statusMap,
    });
  const { mutate: addLog } = useAddLog();

  const setSelectedCell =
    useSelectedCellStore(
      (state) =>
        state.setSelectedCell
    );

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden">
      <div className="flex flex-1 justify-end overflow-hidden">
        <div
          className="grid w-full"
          style={{
            minWidth: `${days.length * 48}px`,
            gridTemplateColumns: `repeat(${days.length}, minmax(48px, 1fr))`,
          }}
        >

          {days.map((day) => {

            const isBeforeStart =
              habit.startDate > day.date;

            const isFuture =
              getIsFuture(day.date);

            const isDisabled =
              isBeforeStart || isFuture;

            const key =
              `${habit.id}-${day.date}`;

            const status =
              statusMap.get(key) ?? null;
            const progress =
              calculateHabitProgress(
                habit,
                completions,
                day.date
              );

            const isDone =
              progress.completed ||
              (status === HABIT_STATUS.COMPLETED &&
                progress.current === 0);

            const isSkipped =
              status ===
              HABIT_STATUS.SKIPPED;

            const isFailed =
              status ===
              HABIT_STATUS.FAILED;

            let variant =
              CELL_VARIANTS.default;

            if (isBeforeStart) {
              variant =
                CELL_VARIANTS.beforeStart;
            } else if (isFuture) {
              variant =
                CELL_VARIANTS.future;
            } else if (isDone) {
              variant =
                CELL_VARIANTS.completed;
            } else if (isSkipped) {
              variant =
                CELL_VARIANTS.skipped;
            } else if (isFailed) {
              variant =
                CELL_VARIANTS.failed;
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
                progress={progress}
                textColor="dark:text-emerald-950"
                unit={habit.unit!}
                setSelectedCell={
                  setSelectedCell
                }
                fillRemaining={() => {
                  const remaining =
                    progress.target - progress.current;

                  if (remaining <= 0) return;

                  addLog({
                    habitId: habit.id,
                    date: day.date,
                    value: remaining,
                  });
                }}
                addValue={(value) => {
                  addLog({
                    habitId: habit.id,
                    date: day.date,
                    value,
                  });
                }}
                toggle={toggle}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";


import { ArrowRight, Check, X } from "lucide-react";
import { Habit, HABIT_STATUS, HabitStatus } from "@/lib/types";

import { Button } from "@/components/ui/button";

import { useHabitActions } from "@/hooks/use-habit-actions";

import { cn } from "@/lib/utils";
import { formatDate, getIsFuture, normalize } from "@/lib/date";
import { useSelectedCellStore } from "@/store/use-selected-cell-store";


type Props = {
  habit: Habit;
  year: number;
  month: number;
  completionMap: Map<string, HabitStatus>;
};

export const TickBox = ({
  habit,
  year,
  month,
  completionMap
}: Props) => {

  const { id, startDate } = habit;
  const setSelectedCell = useSelectedCellStore(s => s.setSelectedCell);
  const { toggle } = useHabitActions({ completionMap });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);


  const created = normalize(new Date(startDate));
  
  return (
    <div
      key={id}
      className="grid grid-cols-[repeat(31,minmax(0,1fr))] gap-x-9 mb-2"
    >
      {days.map((day) => {
        const dateObj = new Date(year, month, day);
        const normalizedDate = normalize(dateObj);
        const date = formatDate(dateObj);
        const status = completionMap.get(`${id}-${date}`) ?? null;

        const isDone = status === HABIT_STATUS.COMPLETED;
        const isSkipped = status === HABIT_STATUS.SKIPPED;
        const isFailed = status === HABIT_STATUS.FAILED;

        const isBeforeStart = normalizedDate < created;
        const isFuture = getIsFuture(date);

        const isDisabled = isBeforeStart || isFuture;

        const stateStyles = isBeforeStart
          ? `
            bg-pink-800/60
            border border-dashed border-gray-400/60 dark:border-zinc-600
            opacity-70
            cursor-not-allowed
            shadow-sm
          `
          : isFuture
          ? `
            bg-blue-900/30
            border border-dashed border-blue-300/60 dark:border-blue-700
            text-blue-500/70 dark:text-blue-400/70
            cursor-not-allowed
            shadow-sm scale-[0.97]
          `
          : isDone
          ? `
            bg-green-500/30 dark:bg-green-500/70
            hover:bg-green-500/40 dark:hover:bg-green-500/80
            shadow-sm
          `
          : isSkipped
          ? `
            bg-amber-500/10
            border border-amber-400/30
            hover:bg-amber-500/20
            text-amber-400
          `
          : isFailed
          ? `
            bg-rose-500/10
            border border-rose-400/30
            hover:bg-rose-500/20
            text-rose-400
          `
          :  `
            bg-gray-100 dark:bg-zinc-800
            hover:bg-gray-200 dark:hover:bg-zinc-700
          `;

        return (
          <ContextMenu
            key={day}
            onOpenChange={(open) => {
              if (open && !isDisabled) {
                setSelectedCell({habitId: id, date});
              }
            }}
          >
            <ContextMenuTrigger asChild>
              <Button
                size="mark"
                variant="mark"
                disabled={isDisabled}
                className={cn(stateStyles, "transition-all duration-200 rounded-md ease-out")}
                onClick={() => {
                  if (isDisabled) return;
                  setSelectedCell({habitId: id, date});

                  toggle(id, date, HABIT_STATUS.COMPLETED);
                }}
              >
                {isDone && <Check className="text-emerald-950" />}
                {isSkipped && <ArrowRight />}
                {isFailed && <X />}

                {!isDisabled && !isDone && !isSkipped && !isFailed && (
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                )}

                {isFuture && (
                  <div className="w-1 h-1 rounded-full bg-blue-700/70 mx-auto" />
                )}
              </Button>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-56">
              <ContextMenuItem onClick={() => toggle(id, date, HABIT_STATUS.COMPLETED)}>
                Mark as Done
                <ContextMenuShortcut> Alt + D</ContextMenuShortcut>
              </ContextMenuItem>

              <ContextMenuItem onClick={() => toggle(id, date, HABIT_STATUS.SKIPPED)}>
                Mark as Skipped
                <ContextMenuShortcut> Alt + S</ContextMenuShortcut>
              </ContextMenuItem>

              <ContextMenuItem onClick={() => toggle(id, date, HABIT_STATUS.FAILED)}>
                Mark as Failed
                <ContextMenuShortcut> Alt + F</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => toggle(id, date, null)}>
                Clear Logs
                <ContextMenuShortcut> Del</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </div>
  );
};
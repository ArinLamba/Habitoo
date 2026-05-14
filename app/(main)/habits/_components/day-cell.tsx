"use client";

import { memo } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { ArrowRight, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HABIT_STATUS, HabitStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  habitId: string;
  date: string;
  status: HabitStatus;
  color: string;
  isDisabled: boolean;
  isFuture: boolean;
  variant: string;
  isBeforeStart: boolean;

  setSelectedCell: (data: {
    habitId: string;
    date: string;
  }) => void;

  toggle: (
    habitId: string,
    date: string,
    status: HabitStatus | null
  ) => void;
};

export const DayCell = memo(({
  habitId,
  date,
  status,
  color,
  isDisabled,
  isFuture,
  variant,
  isBeforeStart,
  setSelectedCell,
  toggle,
}: Props) => {
  const isDone = status === HABIT_STATUS.COMPLETED;
  const isSkipped = status === HABIT_STATUS.SKIPPED;
  const isFailed = status === HABIT_STATUS.FAILED;

  const handleToggle = (nextStatus: HabitStatus | null) => {
    if (isDisabled) return;

    setSelectedCell({
      habitId,
      date,
    });

    toggle(habitId, date, nextStatus);
  };

  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (open && !isDisabled) {
          setSelectedCell({
            habitId,
            date,
          });
        }
      }}
    >
      <ContextMenuTrigger asChild>
        <Button
          size="mark"
          variant="mark"
          disabled={isDisabled}
          onClick={() => handleToggle(HABIT_STATUS.COMPLETED)}
          className={cn(
            variant,
            "transition-all duration-200 rounded-none px-5 py-4.25 ease-out"
          )}
          style={
            isDone
              ? {
                  backgroundColor: color,
                }
              : isBeforeStart
              ? {
                  backgroundImage: `
                    repeating-linear-gradient(
                      135deg,
                      rgba(255,255,255,0.40),
                      rgba(255,255,255,0.09) 2px,
                      transparent 2px,
                      transparent 7px
                    )
                  `,
                }
              : undefined
          }
        >
          {isDone && <Check className="text-emerald-950" />}
          {isSkipped && <ArrowRight />}
          {isFailed && <X />}

          {!isDisabled &&
            !isDone &&
            !isSkipped &&
            !isFailed && (
              <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            )}

          {isFuture && (
            <div className="w-1 h-1 rounded-full bg-blue-700/70 mx-auto" />
          )}
        </Button>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-56">
        <ContextMenuItem
          onClick={() =>
            handleToggle(HABIT_STATUS.COMPLETED)
          }
        >
          Mark as Done
          <ContextMenuShortcut>
            Alt + D
          </ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() =>
            handleToggle(HABIT_STATUS.SKIPPED)
          }
        >
          Mark as Skipped
          <ContextMenuShortcut>
            Alt + S
          </ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() =>
            handleToggle(HABIT_STATUS.FAILED)
          }
        >
          Mark as Failed
          <ContextMenuShortcut>
            Alt + F
          </ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => handleToggle(null)}
        >
          Clear Logs
          <ContextMenuShortcut>
            Del
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

DayCell.displayName = "DayCell";
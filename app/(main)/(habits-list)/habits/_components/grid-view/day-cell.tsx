"use client";

import { memo } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { ArrowRight, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HABIT_STATUS, HabitStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Progress = {
  current: number;
  target: number;
  completed: boolean;
  percentage: number;
};

type Props = {
  habitId: string;
  date: string;
  status: HabitStatus;
  color: string;
  isDisabled: boolean;
  isFuture: boolean;
  variant: string;
  isBeforeStart: boolean;
  progress: Progress;
  transparentFill?: boolean;
  textColor?: string;
  unit: string;

  setSelectedCell: (data: {
    habitId: string;
    date: string;
  }) => void;

  fillRemaining: () => void;
  addValue?: (value: number) => void;

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
  progress,
  transparentFill = false,
  textColor = "text-white",
  unit,
  setSelectedCell,
  fillRemaining,
  addValue,
  toggle,
}: Props) => {
  const isLegacyDone =
    status === HABIT_STATUS.COMPLETED &&
    progress.current === 0;
  const isDone = progress.completed || isLegacyDone;
  const hasProgress = progress.current > 0 && !isDone;
  const isSkipped = status === HABIT_STATUS.SKIPPED;
  const isFailed = status === HABIT_STATUS.FAILED;

  const selectCell = () => {
    setSelectedCell({
      habitId,
      date,
    });
  };

  const handleFillRemaining = () => {
    if (isDisabled) return;

    selectCell();

    if (isDone) return;

    fillRemaining();
  };

  const handleStatus = (nextStatus: HabitStatus | null) => {
    if (isDisabled) return;

    selectCell();

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
          onClick={handleFillRemaining}
          className={cn(
            variant,
            "relative transition-all duration-200 rounded-none h-9 w-full overflow-hidden ease-out"
          )}
          style={
            !transparentFill && isDone
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
          {!transparentFill && hasProgress && (
            <div
              className="absolute inset-y-0 left-0 opacity-70 transition-all"
              style={{
                width: `${progress.percentage}%`,
                backgroundColor: color,
              }}
            />
          )}

          {isDone && <Check className={textColor}/>}
          {isSkipped && !isDone && <ArrowRight />}
          {isFailed && <X />}

          {!isDisabled &&
            !isDone &&
            !isSkipped &&
            !isFailed && (
              <div className="relative z-10 w-1 h-1 rounded-full bg-muted-foreground/40" />
            )}

          {isFuture && (
            <div className="relative z-10 w-1 h-1 rounded-full bg-blue-700/70 mx-auto" />
          )}
        </Button>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-56">
        <ContextMenuItem
          onClick={() =>
            handleFillRemaining()
          }
        >
          Fill Remaining
          <ContextMenuShortcut>
            Alt + D
          </ContextMenuShortcut>
        </ContextMenuItem>

        {addValue && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              Add Logs
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-40">
              {[1, Math.max(1, Math.round(progress.target / 2)), progress.target].map(
                (value, index) => (
                  <ContextMenuItem
                    key={`${value}-${index}`}
                    onClick={() => {
                      selectCell();
                      addValue(value);
                    }}
                  >
                    +{value} {unit}
                  </ContextMenuItem>
                )
              )}
              <ContextMenuSeparator />
              <ContextMenuItem onClick={handleFillRemaining}>
                Fill Remaining
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        <ContextMenuItem
          onClick={() =>
            handleStatus(HABIT_STATUS.SKIPPED)
          }
        >
          Mark as Skipped
          <ContextMenuShortcut>
            Alt + S
          </ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() =>
            handleStatus(HABIT_STATUS.FAILED)
          }
        >
          Mark as Failed
          <ContextMenuShortcut>
            Alt + F
          </ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => handleStatus(null)}
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

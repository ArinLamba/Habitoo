import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Button } from "@/components/ui/button";

import {
  formatDate,
  getIsFuture,
  getToday,
} from "@/lib/date";

import {
  HABIT_STATUS,
  HabitStatus,
} from "@/lib/types";

import { cn } from "@/lib/utils";

import {
  ArrowRight,
  Check,
  X,
} from "lucide-react";

type Props = {
  dateObj: Date;
  habitId: string;
  startDate: string;
  color: string;

  status?: HabitStatus;

  toggle: (
    habitId: string,
    date: string,
    status: HabitStatus | null
  ) => void;

  onSelectDate: (date: Date) => void;
  setSelectedCell: (data: {
    habitId: string;
    date: string;
  }) => void;
};

export const HabitCalendarCell = ({
  dateObj,
  habitId,
  startDate,
  color,
  status,
  toggle,
  onSelectDate,
  setSelectedCell
}: Props) => {

  const handleToggle = (nextStatus: HabitStatus | null) => {
    setSelectedCell({
      habitId,
      date,
    });
    toggle(habitId, date, nextStatus);
  };
  const date = formatDate(dateObj);

  const isCompleted =
    status === HABIT_STATUS.COMPLETED;

  const isSkipped =
    status === HABIT_STATUS.SKIPPED;

  const isFailed =
    status === HABIT_STATUS.FAILED;

  const isFuture = getIsFuture(date);
  

  const isToday =
    getToday() === date;

    const isBeforeStart = date < startDate;
    const isDisabled = isBeforeStart || isFuture

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      {/* Day */}
      <Button
        variant="calendar"
        className={cn(
          "flex  items-center justify-center rounded-full text-xs",

          isToday &&
            "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
        )}
        onClick={() => onSelectDate(dateObj)}
      >
        {dateObj.getDate()}
      </Button>

      {/* Mark */}
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Button
            variant="mark"
            disabled={isDisabled}
            onClick={() => handleToggle(HABIT_STATUS.COMPLETED)}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200",

              isFuture &&
                "border-dashed border-rose-400",

              !isFuture &&
                "border-zinc-400 hover:scale-105",

              isFailed &&
                "border-red-500/40 bg-red-500/10",
              isBeforeStart && 
                "bg-rose-700/70"
            )}
            style={
              isCompleted
                ? {
                    backgroundColor: color,
                    borderColor: color,
                  }
                : isSkipped
                ? {
                    backgroundColor: `${color}15`,
                    borderColor: `${color}40`,
                  }
                : undefined
            }
          >
            {isCompleted && (
              <Check className="size-3 text-white" />
            )}

            {isSkipped && (
              <ArrowRight
                className="size-3"
                color={color}
              />
            )}

            {isFailed && (
              <X className="size-3 text-red-500" />
            )}

            {!isCompleted &&
              !isSkipped &&
              !isFailed &&
              !isDisabled && (
                <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              )}
          </Button>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-52">
          <ContextMenuItem
            onClick={() => handleToggle(HABIT_STATUS.COMPLETED)}
          >
            Mark as Done

            <ContextMenuShortcut>
              Alt + D
            </ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => handleToggle(HABIT_STATUS.SKIPPED)}
          >
            Mark as Skipped

            <ContextMenuShortcut>
              Alt + S
            </ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => handleToggle(HABIT_STATUS.FAILED)}
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
    </div>
  );
};
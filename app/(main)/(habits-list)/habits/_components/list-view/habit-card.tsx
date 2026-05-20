"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Flame, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";

import { formatDate } from "@/lib/date";
import { calculateHabitProgress } from "@/lib/habits/progress";
import { Habit, HabitStatus, Completion } from "@/lib/types";
import { HabitIconName, ICON_MAP } from "@/lib/habit-icons";
import { cn } from "@/lib/utils";
import { useDateStore } from "@/store/use-date-store";
import { useAddLog } from "@/hooks/mutations/use-add-log";
import { HabitActions } from "../habit-actions";

type Props = {
  habit: Habit;
  completions: Completion[];
  statusMap: Map<string, HabitStatus>;
  currentStreak: number;
  longestStreak: number;
};

export const HabitCard = ({
  habit,
  completions,
  currentStreak,
  longestStreak,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  const currentDate = useDateStore((state) => state.currentDate);
  const date = formatDate(currentDate);
  const { mutate: addLog, isPending } = useAddLog();

  const progress = useMemo(
    () =>
      calculateHabitProgress(
        habit,
        completions,
        date
      ),
    [habit, completions, date]
  );

  const IconComponent =
    ICON_MAP[habit.icon as HabitIconName] ||
    ICON_MAP.QuestionMark;

  const displayCurrent = Math.min(
    progress.current,
    progress.target
  );
  const remaining = Math.max(
    0,
    progress.target - progress.current
  );
  const unit = habit.unit ?? "times";

  const fillRemaining = () => {
    if (remaining <= 0) return;

    addLog({
      habitId: habit.id,
      date,
      value: remaining,
    });
  };

  const addValue = (nextValue: number) => {
    if (nextValue <= 0) return;

    addLog({
      habitId: habit.id,
      date,
      value: nextValue,
    });
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <div className="border-b border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-950">
          <div className="grid grid-cols-[58px_1fr_auto] items-center gap-3">
            <div className="flex flex-col items-center">
              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-full p-[3.5px]"
                style={{
                  background: `conic-gradient(
                    ${habit.color} ${progress.percentage}%,
                    rgba(255,255,255,0.14) 0
                  )`,
                }}
              >
                <div className="flex h-full w-full items-center justify-center  rounded-full bg-white dark:bg-zinc-950">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: `${habit.color}20`,
                    }}
                  >
                    <IconComponent color={habit.color!} size={22} />
                  </div>
                </div>
              </div>
              <span
                className="mt-1 text-[11px] font-semibold leading-none"
                style={{ color: habit.color! }}
              >
                {currentStreak}
              </span>
            </div>

            <div className="  items-center gap-1.5 ">
              <Link 
                href={`/habits/${habit.id}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-block w-fit max-w-full"
              >
                <h3 className="truncate text-[15px] font-semibold leading-tight hover:scale-105 transition-transform">
                  {habit.name}
                </h3>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {displayCurrent} / {progress.target} {unit}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  addValue(1);
                }}
                className="h-8 rounded-full px-3 text-xs"
              >
                {/* <Plus className="h-3.5 w-3.5" size={15}/> */}
                + 1 {unit}
              </Button>

              <Button
                variant={progress.completed ? "secondary" : "outline"}
                size="sm"
                disabled={isPending || remaining <= 0}
                onClick={(e) => {
                  e.stopPropagation();
                  fillRemaining();
                }}
                className={cn(
                  "h-8 rounded-full px-3 text-xs",
                  progress.completed &&
                    "border-emerald-500/30 text-emerald-600"
                )}
              >
                <Check className="h-3.5 w-3.5" />
                Done
              </Button>
              
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Open habit actions"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((prev) => !prev);
                }}
              >
                <ChevronDown
                  className={cn(
                    "transition-transform",
                    open && "rotate-180"
                  )}
                />
              </Button>
          
            </div>
          </div>

          <CollapsibleContent>
            <div className="ml-[70px] mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 rounded-md border border-black/10 bg-muted/40 px-3 py-2 text-xs dark:border-white/10">
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {currentStreak}
                </span>
                <span className="text-muted-foreground">
                  Best {longestStreak}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={value}
                  onChange={(event) =>
                    setValue(Math.max(0, Number(event.target.value)))
                  }
                  className="h-8 w-20"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addValue(value)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Log
                </Button>
              </div>
              <HabitActions habit={habit} />
            </div>
          </CollapsibleContent>
        </div>
      </CollapsibleTrigger>
    </Collapsible>
  );
};

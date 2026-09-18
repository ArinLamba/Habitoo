"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


import { formatDate, formatDisplayDate } from "@/lib/date";
import { calculateHabitProgress } from "@/lib/habits/progress";
import { Habit, HabitStatus, Completion } from "@/lib/types";
import { HabitIconName, ICON_MAP } from "@/lib/habit-icons";

import { useDateStore } from "@/store/use-date-store";
import { useAddLog } from "@/hooks/mutations/use-add-log";

import { HabitProgressIcon } from "./habit-progress-icon";
import { HabitExpandedContent } from "./habit-expanded-content";
import { HabitQuickActions } from "./habit-quick-actions";
import { useCompletionSound } from "@/hooks/use-completion-sound";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const isBeforeHabitStart = date < habit.startDate;
  const canLog = !isBeforeHabitStart;

  const { audio: doneAudio, play: playDoneSound } = useCompletionSound();

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
    console.log("DONE CLICKED", { remaining });
    if (!canLog || remaining <= 0) return;
    
    playDoneSound();
    
    addLog({
      habitId: habit.id,
      date,
      value: remaining,
    });
    console.log("DONE CLICKED", { remaining });
  };

  const addValue = (nextValue: number) => {
    if (!canLog || nextValue <= 0) return;

    playDoneSound();

    addLog({
      habitId: habit.id,
      date,
      value: nextValue,
    });
  };

  return (
    <>
      {doneAudio}
      <Collapsible open={open} onOpenChange={setOpen}>
          <div className="border-b border-black/10 bg-white px-4 py-3 transition-colors hover:bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/[0.03]">
            <CollapsibleTrigger asChild>
              <div className="grid grid-cols-[58px_1fr_auto]  items-center gap-3">
                <HabitProgressIcon
                  color={habit.color}
                  percentage={progress.percentage}
                  currentStreak={currentStreak}
                  IconComponent={IconComponent}
                />

                <div className=" gap-1.5 ">
                  <div className="flex gap-x-2">
                    <Link 
                      href={`/habits/${habit.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block w-fit max-w-full"
                    >
                      <h3 className={cn(
                        "truncate text-[15px] font-semibold leading-tight hover:scale-105 transition-transform",
                        !canLog && "text-muted-foreground",
                        )}>
                        {habit.name}
                      </h3>
                    </Link>
                    {!canLog && <div className="flex items-center gap-x-1 text-xs text-amber-400/70 cursor-default">
                        <Info size={14}/>
                        <p>
                          Habit was not availabe on {formatDisplayDate(date)}
                        </p>
                      </div>
                    }
                  </div>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    {displayCurrent} / {progress.target} {unit}
                  </p>
                </div>

                <HabitQuickActions
                  unit={unit}
                  isPending={isPending}
                  completed={progress.completed}
                  remaining={remaining}
                  open={open}
                  setOpen={setOpen}
                  addValue={addValue}
                  fillRemaining={fillRemaining}
                  disabled={!canLog}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <HabitExpandedContent
                value={value}
                setValue={setValue}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                addValue={addValue}
                habit={habit}
                disabled={!canLog}
              />
            </CollapsibleContent>
          </div>
        
      </Collapsible>
    </>
  );
};

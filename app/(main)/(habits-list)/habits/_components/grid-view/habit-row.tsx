"use client";
import { memo } from "react";
import Link from "next/link";

import { Flame } from "lucide-react";

import { ICON_MAP, HabitIconName } from "@/lib/habit-icons";


import { Habit, HabitStatus } from "@/lib/types";
import { Completion } from "@/lib/types";

import { HabitActions } from "../habit-actions";

import { HabitFrequencyGrid } from "./habit-frequency-grid";

type Props = {
  habit: Habit;
  completions: Completion[];
  statusMap: Map<string, HabitStatus>;
  streak: number;
};

export const HabitRow = memo(({
  habit,
  completions,
  statusMap,
  streak
}: Props) => {
  
  const IconComponent = (ICON_MAP[habit.icon as HabitIconName] ) || ICON_MAP.QuestionMark;

  return (
    <div className="flex items-stretch border-b border-black/10 transition-colors hover:bg-zinc-50/70 dark:border-white/10 dark:hover:bg-white/[0.03]">

      {/* LEFT */}
      <div className="w-[250px]">
        <div className="flex w-[250px]">
          <Link href={`habits/${habit.id}`} className="flex flex-1 items-center gap-x-2 px-3 transition-colors hover:text-emerald-600">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${habit.color}18` }}
            >
              <IconComponent
                size={17}
                color={habit.color!}
                />
            </div>

            <div className="w-full truncate text-sm font-medium">
              {habit.name}
            </div>
            {/* Progress Area */}
            
          </Link>
          <HabitActions habit={habit}/>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-px bg-black/10 dark:bg-white/10" />
      
      {/* RIGHT */}
      <div className="flex flex-1 min-w-0 overflow-hidden">


        {/* GRID ACCORDING TO FREQUENCY */}
        <HabitFrequencyGrid
          habit={habit}
          completions={completions}
          statusMap={statusMap}
        />
        {/* STREAK */}

        <div className="flex w-14 shrink-0 items-center justify-center border-l border-black/10 text-sm font-semibold text-amber-600 dark:border-white/10">
          <div className="flex items-center gap-x-1">
            <Flame
              size={16}
              fill="orange"
              stroke="orange"
            />
            <p>{streak}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

HabitRow.displayName = "HabitRow";

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
            {/* Progress Area */}
            
          </Link>
          <HabitActions habit={habit}/>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-0.5 bg-black/10 dark:bg-white/10" />
      
      {/* RIGHT */}
      <div className="flex flex-1 min-w-0 overflow-hidden">


        {/* GRID ACCORDING TO FREQUENCY */}
        <HabitFrequencyGrid
          habit={habit}
          completions={completions}
          statusMap={statusMap}
        />
        {/* STREAK */}

        <div className="w-14 shrink-0 flex items-center justify-center border-l border-black/10 dark:border-white/10 text-amber-600 text-sm font-semibold">
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
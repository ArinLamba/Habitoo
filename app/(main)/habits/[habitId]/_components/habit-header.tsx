"use client";
import * as Icons from "lucide-react";

import { RangeSelect } from "@/components/range-selector";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Notebook } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditHabitInput } from "../../_components/edit-habit-input";
import { Habit, LucideIconName } from "@/lib/types";

type Props = {
  habit: Habit;
};

export const HabitHeader = ({ habit }: Props) => {
  const IconComponent = (Icons[habit.icon as LucideIconName] as React.ElementType) || Icons.Activity;

  const router = useRouter();
  

  return (
    <div className="flex justify-between items-center border text-sm dark:bg-zinc-900 bg-white shadow-lg rounded-sm">
      <div className="flex items-center">
        <Button variant="ghost" aria-label="Go Back" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <Separator orientation="vertical"/>
        <div className="ml-4 flex">
          <IconComponent size={18} color={habit.color}/>
          <h2 className="ml-2">{habit.name}</h2>
        </div>

      </div>

      <div className="flex items-center">
        <Separator orientation="vertical"/>
        <RangeSelect />
        <Separator orientation="vertical"/>
        <div className="flex items-center">
          <EditHabitInput habit={habit}/>
          <Separator orientation="vertical"/>
          <Button variant={"ghost"} className="">
            <Notebook />
          </Button>
        </div>
      </div>
    </div>
  );
};
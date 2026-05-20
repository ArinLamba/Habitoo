"use client";

import { RangeSelect } from "@/components/range-selector";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { ChevronLeft, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditHabitInput } from "@/app/(main)/(habits-list)/habits/_components/edit-habit-input";
import { Completion, Habit } from "@/lib/types";
import { HabitIconName, ICON_MAP } from "@/lib/habit-icons";
import { AddLogForm } from "@/app/(main)/(habits-list)/habits/_components/grid-view/add-log-form";
import { MobileLeftSidebar } from "@/components/layout/mobile-left-sidebar";
import { MobileRightSidebar } from "@/components/layout/mobile-right-sidebar";
import { HabitDetailsPanel } from "./habit-detail-panel";

type Props = {
  habit: Habit;
  logs: Completion[];
};

export const HabitHeader = ({ habit, logs }: Props) => {
  const IconComponent = (ICON_MAP[habit.icon as HabitIconName] as React.ElementType) || ICON_MAP.Social;

  const router = useRouter();
  

  return (
    <div className="flex justify-between items-center border text-sm dark:bg-zinc-900 bg-white shadow-lg rounded-sm">
      <div className="flex items-center">
        <MobileLeftSidebar />
        <Separator orientation="vertical" className="xl:hidden block"/>
        <Button variant="ghost" aria-label="Go Back" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <Separator orientation="vertical"/>
        <div className="ml-4 flex">
          <IconComponent size={20} color={habit.color}/>
          <h2 className="ml-2">{habit.name}</h2>
        </div>

      </div>

      <div className="flex items-center">
        <Separator orientation="vertical"/>
        <RangeSelect />
        <Separator orientation="vertical"/>
        <div className="flex items-center">
          <EditHabitInput habit={habit}>
            <Button variant={"ghost"}>
              <PencilIcon />
            </Button>
          </EditHabitInput>
          <Separator orientation="vertical"/>
          <AddLogForm habit={habit}/>
            <Separator orientation="vertical" className="lg:hidden block"/>
          <MobileRightSidebar >
            <HabitDetailsPanel habit={habit} logs={logs}/>
          </MobileRightSidebar>
        </div>
      </div>
    </div>
  );
};
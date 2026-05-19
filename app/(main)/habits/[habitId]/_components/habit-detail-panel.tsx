"use client";
import { LogHistory } from "./log-history";
import { HabitDetailsHeader } from "./habit-detail-header";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";

import { Completion, Habit } from "@/lib/types";
import { Notes } from "./notes";
import { HabitAbout } from "./habit-about";

type Props = {
  habit: Habit;
  logs: Completion[];
};

export const HabitDetailsPanel = ({
  habit,
  logs
}: Props) => {
  const [selectedTab, setSelectedTab] = useState<"LogHistory" | "Notes" | "About">("LogHistory")
  if(!habit.unit) return null;

  return (
    <div>
      <HabitDetailsHeader
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <Separator />
      <div>
        {selectedTab === "LogHistory" && (
          <LogHistory logs={logs} unit={habit.unit}/>
        )}

        {selectedTab === "Notes" && (
          <Notes />
        )}

        {selectedTab === "About" && (
          <HabitAbout key={habit.id} habit={habit} />
        )}
      </div>
    </div>
  );
};
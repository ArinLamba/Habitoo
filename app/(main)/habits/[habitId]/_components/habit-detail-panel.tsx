"use client";
import { LogHistory } from "./log-history";
import { HabitDetailsHeader } from "../habit-detail-header";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";

import { Completion, Habit } from "@/lib/types";

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
          <div className="p-4">
            Notes coming soon
          </div>
        )}

        {selectedTab === "About" && (
          <div className="p-4">
            About section
          </div>
        )}
      </div>
    </div>
  );
};
"use client";
import { LogHistory } from "./log-history";
import { HabitDetailsHeader } from "./habit-detail-header";

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
    <section className="flex flex-col gap-3">
      <HabitDetailsHeader
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <div className="overflow-hidden rounded-md border border-black/10 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-900/70">
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
    </section>
  );
};

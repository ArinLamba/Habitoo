import type { Habit, Completion } from "@habitoo/core";
import { memo, useState } from "react";
import { Text, View } from "react-native";

import {
  HabitDetailsPanelTabs,
  type HabitDetailsPanelTab,
} from "./habit-details-panel-tabs";
import { HabitDetailsAbout } from "./habit-details-about";
import { LogHistoryList } from "./log-history-list";

type HabitDetailsPanelProps = {
  habit: Habit;
  logs: Completion[];
  isDeleting?: boolean;
  isDeletingLogs?: boolean;
  onDelete: () => void;
  onDeleteLogs?: (logIds: string[]) => void;
};

export const HabitDetailsPanel = memo(function HabitDetailsPanel({
  habit,
  logs,
  isDeleting,
  isDeletingLogs,
  onDelete,
  onDeleteLogs,
}: HabitDetailsPanelProps) {
  const [selectedTab, setSelectedTab] = useState<HabitDetailsPanelTab>("LogHistory");
  const unit = habit.unit || "times";

  return (
    <View className="flex-1 gap-3">
      <HabitDetailsPanelTabs
        selectedTab={selectedTab}
        onSelectTab={(tab) => {
          if (tab !== "Progress") {
            setSelectedTab(tab);
          }
        }}
      />

      <View className="min-h-0 flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70">
        {selectedTab === "LogHistory" ? (
          <LogHistoryList
            isDeleting={isDeletingLogs}
            logs={logs}
            unit={unit}
            onDeleteLogs={onDeleteLogs}
          />
        ) : null}

        {selectedTab === "Notes" ? (
          <Text className="px-4 py-6 text-sm font-semibold text-zinc-500">
            Notes will appear here.
          </Text>
        ) : null}

        {selectedTab === "About" ? (
          <HabitDetailsAbout
            habit={habit}
            isDeleting={isDeleting}
            onDelete={onDelete}
          />
        ) : null}
      </View>
    </View>
  );
});

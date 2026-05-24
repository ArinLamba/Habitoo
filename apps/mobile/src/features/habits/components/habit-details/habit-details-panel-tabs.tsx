import { memo } from "react";
import { Pressable, Text, View } from "react-native";

export type HabitDetailsPanelTab = "Progress" | "Notes" | "About" | "LogHistory";

type HabitDetailsPanelTabsProps = {
  selectedTab: HabitDetailsPanelTab;
  onSelectTab: (tab: HabitDetailsPanelTab) => void;
};

const tabs: { key: HabitDetailsPanelTab; label: string }[] = [
  { key: "Progress", label: "Progress" },
  { key: "Notes", label: "Notes" },
  { key: "About", label: "About" },
  { key: "LogHistory", label: "Log History" },
];

export const HabitDetailsPanelTabs = memo(function HabitDetailsPanelTabs({
  selectedTab,
  onSelectTab,
}: HabitDetailsPanelTabsProps) {
  return (
    <View className="flex-row border-b border-zinc-800 bg-zinc-950">
      {tabs.map((tab) => {
        const selected = selectedTab === tab.key;

        return (
          <Pressable
            accessibilityRole="button"
            className="flex-1 items-center py-3"
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
          >
            <Text
              className={`text-sm font-extrabold ${
                selected ? "text-sky-400" : "text-zinc-500"
              }`}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
            <View
              className={`mt-2 h-1 w-10 rounded-full ${
                selected ? "bg-sky-500" : "bg-transparent"
              }`}
            />
          </Pressable>
        );
      })}
    </View>
  );
});

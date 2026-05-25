import type { Habit } from "@habitoo/core";
import {
  ArrowLeft,
  ChevronLeft,
  Pencil,
  Plus,
} from "lucide-react-native";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { ICON_MAP, type HabitIconName } from "../../../../lib/habits-icon";
import {
  HabitDetailsRangeSelect,
  type HeatmapRange,
} from "./habit-details-range-select";
import {
  HabitDetailsPanelTabs,
  type HabitDetailsPanelTab,
} from "./habit-details-panel-tabs";
import { colors } from "@/src/shared/theme/colors";

type HabitDetailsHeaderProps = {
  habit: Habit;
  range: HeatmapRange;
  onBack: () => void;
  onEdit: () => void;
  onAddLog: () => void;
  onRangeChange: (range: HeatmapRange) => void;
  selectedTab: HabitDetailsPanelTab;
  onSelectTab: (tab: HabitDetailsPanelTab) => void;
};

export const HabitDetailsHeader = memo(function HabitDetailsHeader({
  habit,
  range,
  onBack,
  onEdit,
  onAddLog,
  onRangeChange,
  selectedTab,
  onSelectTab,
}: HabitDetailsHeaderProps) {
  const Icon = ICON_MAP[habit.icon as HabitIconName] || ICON_MAP.QuestionMark;
  const color = habit.color || "#34d399";

  return (
    <View className="border-b border-zinc-800 bg-zinc-950/95 mt-2">
      <View className="flex-row items-center px-4">
        <Pressable
          accessibilityRole="button"
          className="h-9 w-9 items-center justify-center rounded-full "
          onPress={onBack}
        >
          <ArrowLeft color="#fff" size={20} />
        </Pressable>

        <View className="min-w-0 flex-1 flex-row items-center gap-2 pr-2 ml-2">
          <View
            className="h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon color={color} size={24} />
          </View>
          <Text className="flex-1 text-[20px] font-extrabold text-white" numberOfLines={1}>
            {habit.name}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          className="h-12 w-11 items-center justify-center"
          onPress={onEdit}
        >
          <Pencil color={colors.muted} size={18} />
        </Pressable>

        <View className="h-8 w-px bg-zinc-800" />

        <View className="px-2">
          <HabitDetailsRangeSelect value={range} onChange={onRangeChange} />
        </View>

        <View className="h-8 w-px bg-zinc-800" />

        <Pressable
          accessibilityRole="button"
          className="h-12 w-11 items-center justify-center"
          onPress={onAddLog}
        >
          <Plus color="#34d399" size={20} strokeWidth={2.5} />
        </Pressable>
      </View>

      <HabitDetailsPanelTabs
        selectedTab={selectedTab}
        onSelectTab={onSelectTab}
      />
    </View>
  );
});

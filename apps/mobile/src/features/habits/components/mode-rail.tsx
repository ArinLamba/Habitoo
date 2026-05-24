import type { HabitMode } from "../utils/group-habits";
import { Archive, Box, CheckCircle2 } from "lucide-react-native";
import { memo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const modes = [
  { key: "active", label: "All Habits", icon: Archive },
  { key: "archived", label: "Archived", icon: Box },
  { key: "completed", label: "End Habits", icon: CheckCircle2 },
] satisfies Array<{
  key: HabitMode;
  label: string;
  icon: typeof Archive;
}>;

type ModeRailProps = {
  value: HabitMode;
  onChange: (mode: HabitMode) => void;
};

export const ModeRail = memo(function ModeRail({ value, onChange }: ModeRailProps) {
  return (
    <View className="mt-1">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="items-center gap-3 px-7"
      >
        {modes.map((mode) => {
          const selected = mode.key === value;
          const Icon = mode.icon;

          return (
            <Pressable
              accessibilityRole="button"
              className={`h-[40px] flex-row items-center justify-center gap-2 rounded-md pr-5 pl-4 ${
                selected ? "bg-zinc-800" : "bg-transparent"
              }`}
              key={mode.key}
              onPress={() => onChange(mode.key)}
            >
              <Icon color={selected ? "#d4d4d8" : "#71717a"} size={16} />
              <Text
                className={`text-[16px] font-extrabold ${
                  selected ? "text-zinc-300" : "text-zinc-500"
                }`}
              >
                {mode.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mt-3 mb-2 items-center">
        <View className="h-1 w-12 rounded-full bg-zinc-700" />
      </View>
    </View>
  );
});

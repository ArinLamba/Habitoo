import type { SuggestedHabit } from "@habitoo/core";
import { SUGGESTED_HABITS } from "@habitoo/core";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { memo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ICON_MAP } from "../../../lib/habits-icon";

type SuggestedHabitPickerProps = {
  onSelect: (habit: SuggestedHabit) => void;
  selectedName: string;
};

export const SuggestedHabitPicker = memo(function SuggestedHabitPicker({
  onSelect,
  selectedName,
}: SuggestedHabitPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
        Suggested habits
      </Text>
      <Pressable
        accessibilityRole="button"
        className="flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
        onPress={() => setOpen((current) => !current)}
      >
        <Text className="text-sm font-bold text-zinc-300">
          {selectedName.trim() || "Choose from habit templates"}
        </Text>
        {open ? (
          <ChevronUp color="#a1a1aa" size={18} />
        ) : (
          <ChevronDown color="#a1a1aa" size={18} />
        )}
      </Pressable>

      {open ? (
        <View className="mt-3 max-h-72 rounded-2xl border border-zinc-800 bg-zinc-950">
          <ScrollView nestedScrollEnabled contentContainerClassName="p-3">
            {SUGGESTED_HABITS.map((group) => (
              <View className="mb-4 last:mb-0" key={group.label}>
                <Text className="mb-2 px-1 text-xs font-extrabold uppercase text-zinc-500">
                  {group.label}
                </Text>
                <View className="gap-2">
                  {group.habits.map((habit) => {
                    const Icon = ICON_MAP[habit.icon] || ICON_MAP.QuestionMark;
                    const selected = selectedName.trim() === habit.name;
                    const color = habit.color ?? "#3b82f6";

                    return (
                      <Pressable
                        accessibilityRole="button"
                        className={`flex-row items-center gap-3 rounded-xl border px-3 py-3 ${
                          selected
                            ? "border-emerald-400 bg-emerald-500/10"
                            : "border-zinc-800 bg-zinc-900"
                        }`}
                        key={habit.name}
                        onPress={() => {
                          onSelect(habit);
                          setOpen(false);
                        }}
                      >
                        <View
                          className="h-9 w-9 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${color}22` }}
                        >
                          <Icon color={color} size={19} />
                        </View>
                        <View className="min-w-0 flex-1">
                          <Text className="text-sm font-extrabold text-white">
                            {habit.name}
                          </Text>
                          <Text className="mt-0.5 text-xs font-semibold text-zinc-500">
                            {habit.targetValue ?? 1} {habit.unit ?? "times"}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
});

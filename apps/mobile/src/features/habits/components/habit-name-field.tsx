import type { SuggestedHabit } from "@habitoo/core";
import { SUGGESTED_HABITS } from "@habitoo/core";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { memo, useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  HABIT_COLORS,
  ICON_CATEGORIES,
  ICON_MAP,
  type HabitIconName,
} from "../../../lib/habits-icon";

type HabitNameFieldProps = {
  color: string;
  icon: HabitIconName;
  onColorChange: (color: string) => void;
  onIconChange: (icon: HabitIconName) => void;
  onNameChange: (name: string) => void;
  onPanelOpenChange?: (open: boolean) => void;
  onSuggestionSelect?: (habit: SuggestedHabit) => void;
  value: string;
};

export const HabitNameField = memo(function HabitNameField({
  color,
  icon,
  onColorChange,
  onIconChange,
  onNameChange,
  onPanelOpenChange,
  onSuggestionSelect,
  value,
}: HabitNameFieldProps) {
  const inputRef = useRef<TextInput>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const SelectedIcon = ICON_MAP[icon] || ICON_MAP.QuestionMark;

  const selectSuggestion = (habit: SuggestedHabit) => {
    onSuggestionSelect?.(habit);
    setSuggestionsOpen(false);
  };

  useEffect(() => {
    onPanelOpenChange?.(suggestionsOpen || appearanceOpen);
  }, [appearanceOpen, onPanelOpenChange, suggestionsOpen]);

  return (
    <View>
      <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
        Habit name
      </Text>
      <View className="rounded-2xl border border-zinc-800 bg-zinc-900">
        <View className="h-14 flex-row items-center px-2">
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-xl"
            onPressIn={() => {
              setSuggestionsOpen(false);
              setAppearanceOpen((current) => !current);
            }}
            style={{ backgroundColor: `${color}22` }}
          >
            <SelectedIcon color={color} size={22} />
          </Pressable>

          <View className="mx-3 h-7 w-px bg-zinc-800" />

          <View className="min-w-0 flex-1">
            <TextInput
              ref={inputRef}
              className="h-12 text-base font-bold text-white"
              onChangeText={onNameChange}
              onFocus={() => {
                setAppearanceOpen(false);
                setSuggestionsOpen((current) => !current)
              }}
              onPress={() => {
                setAppearanceOpen(false);
                setSuggestionsOpen((current) => !current)
              }}
              placeholder="Enter habit name"
              placeholderTextColor="#71717a"
              value={value}
            />
          </View>

          {onSuggestionSelect ? (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-xl"
              onPressIn={() => {
                setAppearanceOpen(false);
                setSuggestionsOpen((current) => !current);
              }}
            >
              <Search color={suggestionsOpen ? color : "#a1a1aa"} size={18} />
            </Pressable>
          ) : null}

          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-xl"
            onPressIn={() => {
              setSuggestionsOpen(false);
              setAppearanceOpen((current) => !current);
            }}
          >
            <SlidersHorizontal color={appearanceOpen ? color : "#a1a1aa"} size={18} />
          </Pressable>
        </View>
      </View>

      {onSuggestionSelect && suggestionsOpen ? (
        <View className="mt-3 max-h-[460px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <ScrollView
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            overScrollMode="always"
            scrollEventThrottle={16}
            showsVerticalScrollIndicator
            contentContainerClassName="p-3"
          >
            {SUGGESTED_HABITS.map((group) => (
              <View className="mb-4 last:mb-0" key={group.label}>
                <Text className="mb-2 px-1 text-xs font-extrabold uppercase text-zinc-500">
                  {group.label}
                </Text>
                <View className="gap-2">
                  {group.habits.map((habit) => {
                    const Icon = ICON_MAP[habit.icon] || ICON_MAP.QuestionMark;
                    const habitColor = habit.color ?? color;
                    const selected = value.trim() === habit.name;

                    return (
                      <Pressable
                        accessibilityRole="button"
                        className={`flex-row items-center gap-3 rounded-xl border px-3 py-3 ${
                          selected
                            ? "border-emerald-400 bg-emerald-500/10"
                            : "border-zinc-800 bg-zinc-900"
                        }`}
                        key={habit.name}
                        onPress={() => selectSuggestion(habit)}
                      >
                        <View
                          className="h-9 w-9 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${habitColor}22` }}
                        >
                          <Icon color={habitColor} size={19} />
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

      {appearanceOpen ? (
        <View className="mt-3 max-h-[520px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <ScrollView
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            overScrollMode="always"
            scrollEventThrottle={16}
            showsVerticalScrollIndicator
            contentContainerClassName="p-3"
          >
            <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
              Color
            </Text>
            <View className="mb-4 flex-row flex-wrap gap-3">
              {HABIT_COLORS.map((item) => (
                <Pressable
                  accessibilityLabel={item.name}
                  accessibilityRole="button"
                  className={`h-9 w-9 rounded-full border-2 ${
                    color === item.value ? "border-white" : "border-transparent"
                  }`}
                  key={item.value}
                  onPress={() => onColorChange(item.value)}
                  style={{ backgroundColor: item.value }}
                />
              ))}
            </View>

            {ICON_CATEGORIES.map((category) => (
              <View className="mb-4 last:mb-0" key={category.label}>
                <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
                  {category.label}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {category.icons.map((item) => {
                    const Icon = ICON_MAP[item.name];
                    const selected = icon === item.name;

                    return (
                      <Pressable
                        accessibilityRole="button"
                        className={`h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900`}
                        key={item.name}
                        style={ selected 
                          ? { backgroundColor: `${color}22`, borderColor: color } 
                          : undefined}
                        onPress={() => onIconChange(item.name)}
                      >
                        <Icon color={color} size={19} />
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

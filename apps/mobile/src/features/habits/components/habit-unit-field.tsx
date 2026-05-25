import { UNIT_GROUPS } from "@habitoo/core";
import { Search } from "lucide-react-native";
import { memo, useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type HabitUnitFieldProps = {
  color: string;
  onChange: (unit: string) => void;
  onPanelOpenChange?: (open: boolean) => void;
  value: string;
};

export const HabitUnitField = memo(function HabitUnitField({
  color,
  onChange,
  onPanelOpenChange,
  value,
}: HabitUnitFieldProps) {
  const inputRef = useRef<TextInput>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const selectUnit = (unit: string) => {
    onChange(unit);
    setSuggestionsOpen(false);
  };

  useEffect(() => {
    onPanelOpenChange?.(suggestionsOpen);
  }, [onPanelOpenChange, suggestionsOpen]);

  return (
    <View>
      <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
        Unit
      </Text>
      <View className="rounded-2xl border border-zinc-800 bg-zinc-900">
        <View className="h-14 flex-row items-center px-2">
          <View className="min-w-0 flex-1 px-2">
            <TextInput
              ref={inputRef}
              className="h-12 text-base font-bold text-white"
              onChangeText={onChange}
              onFocus={() => setSuggestionsOpen(true)}
              placeholder="times, minutes, pages..."
              placeholderTextColor="#71717a"
              value={value}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-xl"
            onPressIn={() => {
              setSuggestionsOpen((current) => !current);
            }}
          >
            <Search color={suggestionsOpen ? color : "#a1a1aa"} size={18} />
          </Pressable>
        </View>
      </View>

      {suggestionsOpen ? (
        <View className="mt-3 max-h-80 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <ScrollView
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            overScrollMode="always"
            scrollEventThrottle={16}
            showsVerticalScrollIndicator
            contentContainerClassName="p-2.5"
          >
            {UNIT_GROUPS.map((group) => (
              <View className="mb-3 last:mb-0" key={group.label}>
                <Text className="mb-1.5 px-1 text-[10px] font-extrabold uppercase text-zinc-500">
                  {group.label}
                </Text>
                <View className="gap-1.5">
                  {group.units.map((unit) => {
                    const selected = value.trim().toLowerCase() === unit;

                    return (
                      <Pressable
                        accessibilityRole="button"
                        className={`rounded-lg border px-3 py-2 ${
                          selected
                            ? "border-emerald-400 bg-emerald-500/10"
                            : "border-zinc-800 bg-zinc-900"
                        }`}
                        key={unit}
                        onPress={() => selectUnit(unit)}
                      >
                        <Text
                          className={`text-sm font-extrabold ${
                            selected ? "text-emerald-300" : "text-zinc-400"
                          }`}
                        >
                          {unit}
                        </Text>
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

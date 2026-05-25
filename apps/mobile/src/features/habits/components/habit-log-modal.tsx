import { getToday, type Habit } from "@habitoo/core";
import { Plus, X } from "lucide-react-native";
import { memo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { DatePickerField } from "./date-picker-field";
import { colors } from "@/src/shared/theme/colors";

type HabitLogModalProps = {
  habit: Habit | null;
  open: boolean;
  isSaving?: boolean;
  selectedDate?: string;
  showDateField?: boolean;
  onClose: () => void;
  onSubmit: (value: number, date: string) => void;
};

export const HabitLogModal = memo(function HabitLogModal({
  habit,
  open,
  isSaving,
  selectedDate,
  showDateField,
  onClose,
  onSubmit,
}: HabitLogModalProps) {
  const [value, setValue] = useState("1");
  const [date, setDate] = useState(selectedDate ?? getToday());

  useEffect(() => {
    if (open) {
      setValue("1");
      setDate(selectedDate ?? getToday());
    }
  }, [open, habit?.id, selectedDate]);

  if (!habit) return null;

  const unit = habit.unit || "times";
  const numericValue = Math.max(0, Number(value) || 0);

  return (
    <Modal animationType="fade" transparent visible={open} onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center bg-black/70 px-8" onPress={onClose}>
        <Pressable
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="mb-4 flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text className="text-xs font-extrabold uppercase text-zinc-500">
                Log progress
              </Text>
              <Text className="mt-1 text-lg font-extrabold text-white" numberOfLines={2}>
                {habit.name}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              className="h-9 w-9 items-center justify-center rounded-full bg-zinc-900"
              onPress={onClose}
            >
              <X color="#a1a1aa" size={16} />
            </Pressable>
          </View>

          <View className="gap-3">
            {showDateField ? (
              <DatePickerField
                label="Date"
                value={date}
                onChange={setDate}
              />
            ) : null}

            <View>
              <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
                Amount ({unit})
              </Text>
              <TextInput
                autoFocus
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-center text-2xl font-extrabold text-white"
                editable={!isSaving}
                keyboardType="decimal-pad"
                onChangeText={setValue}
                value={value}
              />
            </View>
          </View>

          <View className="mt-4 flex-row gap-2">
            <Pressable
              accessibilityRole="button"
              className="h-11 flex-1 items-center justify-center rounded-xl bg-zinc-900"
              disabled={isSaving}
              onPress={onClose}
            >
              <Text className="font-extrabold text-zinc-300">Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-xl "
              disabled={isSaving || numericValue <= 0 || !date}
              onPress={() => onSubmit(numericValue, date)}
              style={{ backgroundColor: colors.accent }}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Plus color="#fff" size={16} strokeWidth={3} />
                  <Text className="font-extrabold text-white">Save log</Text>
                </>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

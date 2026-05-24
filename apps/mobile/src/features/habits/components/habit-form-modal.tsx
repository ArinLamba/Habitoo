import {
  formatDate,
  type Habit,
  type HabitFormValues,
  type HabitFrequency,
  type SuggestedHabit,
} from "@habitoo/core";
import { X } from "lucide-react-native";
import { memo, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import type { HabitIconName } from "../../../lib/habits-icon";
import { DatePickerField } from "./date-picker-field";
import { HabitNameField } from "./habit-name-field";
import { useCreateHabit } from "../hooks/mutations/use-create-habit";
import { useUpdateHabit } from "../hooks/mutations/use-update-habit";

type HabitFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string;
  habit?: Habit | null;
};

const frequencies = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
] satisfies Array<{ value: HabitFrequency; label: string }>;

function habitToFormValues(habit: Habit): HabitFormValues {
  return {
    name: habit.name,
    description: habit.description ?? "",
    startDate: habit.startDate,
    targetValue: habit.targetValue,
    unit: habit.unit ?? "times",
    frequency: habit.frequency,
    icon: habit.icon ?? "QuestionMark",
    color: habit.color ?? "#34d399",
  };
}

export const HabitFormModal = memo(function HabitFormModal({
  open,
  onOpenChange,
  selectedDate,
  habit = null,
}: HabitFormModalProps) {
  const isEdit = !!habit;
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();

  const defaultValues = useMemo<HabitFormValues>(
    () =>
      habit
        ? habitToFormValues(habit)
        : {
            name: "",
            description: "",
            startDate: selectedDate || formatDate(new Date()),
            targetValue: 1,
            unit: "times",
            frequency: "day",
            icon: "QuestionMark",
            color: "#34d399",
          },
    [habit, selectedDate]
  );

  const [values, setValues] = useState<HabitFormValues>(defaultValues);

  useEffect(() => {
    if (open) {
      setValues(defaultValues);
    }
  }, [defaultValues, open]);

  const setValue = <Key extends keyof HabitFormValues>(
    key: Key,
    value: HabitFormValues[Key]
  ) => setValues((current) => ({ ...current, [key]: value }));

  const applySuggestion = (suggested: SuggestedHabit) => {
    setValues((current) => ({
      ...current,
      name: suggested.name,
      icon: suggested.icon,
      color: suggested.color ?? current.color,
      targetValue: suggested.targetValue ?? current.targetValue,
      unit: suggested.unit ?? current.unit,
      frequency: suggested.frequency ?? current.frequency,
    }));
  };

  const close = () => onOpenChange(false);

  const isPending = isEdit ? updateHabit.isPending : createHabit.isPending;
  const isError = isEdit ? updateHabit.isError : createHabit.isError;

  const submit = () => {
    const name = values.name.trim();
    if (name.length < 2 || isPending) return;

    const payload = {
      ...values,
      name,
      targetValue: Math.max(1, Number(values.targetValue) || 1),
    };

    if (isEdit && habit) {
      updateHabit.mutate(
        { habitId: habit.id, values: payload },
        { onSuccess: close }
      );
      return;
    }

    createHabit.mutate(payload, { onSuccess: close });
  };

  return (
    <Modal animationType="slide" transparent visible={open} onRequestClose={close}>
      <Pressable className="flex-1 justify-end bg-black/70" onPress={close}>
        <Pressable
          className="max-h-[88%] rounded-t-3xl border-t border-zinc-800 bg-zinc-950"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-zinc-800 px-6 py-5">
            <View>
              <Text className="text-xl font-extrabold text-white">
                {isEdit ? "Edit Habit" : "New Habit"}
              </Text>
              <Text className="mt-1 text-sm font-semibold text-zinc-500">
                {isEdit
                  ? "Update your goal and appearance."
                  : "Build something small enough to repeat."}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-zinc-900"
              onPress={close}
            >
              <X color="#d4d4d8" size={18} />
            </Pressable>
          </View>

          <ScrollView contentContainerClassName="gap-5 px-6 py-5">
            <HabitNameField
              color={values.color}
              icon={(values.icon as HabitIconName) || "QuestionMark"}
              onColorChange={(color) => setValue("color", color)}
              onIconChange={(icon) => setValue("icon", icon)}
              onNameChange={(text) => setValue("name", text)}
              onSuggestionSelect={isEdit ? undefined : applySuggestion}
              value={values.name}
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
                  Goal
                </Text>
                <TextInput
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base font-bold text-white"
                  keyboardType="numeric"
                  onChangeText={(text) => setValue("targetValue", Number(text) || 1)}
                  value={String(values.targetValue)}
                />
              </View>
              <View className="flex-1">
                <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
                  Unit
                </Text>
                <TextInput
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base font-bold text-white"
                  onChangeText={(text) => setValue("unit", text)}
                  value={values.unit}
                />
              </View>
            </View>

            <View>
              <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
                Frequency
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {frequencies.map((frequency) => {
                  const selected = values.frequency === frequency.value;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      className={`rounded-full border px-4 py-2 ${
                        selected
                          ? "border-emerald-400 bg-emerald-500/10"
                          : "border-zinc-800 bg-zinc-900"
                      }`}
                      key={frequency.value}
                      onPress={() => setValue("frequency", frequency.value)}
                    >
                      <Text
                        className={`font-extrabold ${
                          selected ? "text-emerald-300" : "text-zinc-500"
                        }`}
                      >
                        {frequency.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <DatePickerField
              label="Start date"
              onChange={(date) => setValue("startDate", date)}
              value={values.startDate}
            />

            {isError ? (
              <Text className="rounded-xl bg-red-950/70 px-4 py-3 text-sm font-bold text-red-200">
                {isEdit
                  ? "Could not update habit. Check the fields and try again."
                  : "Could not create habit. Check the fields and try again."}
              </Text>
            ) : null}
          </ScrollView>

          <View className="flex-row gap-3 border-t border-zinc-800 px-6 py-5">
            <Pressable
              accessibilityRole="button"
              className="h-12 flex-1 items-center justify-center rounded-xl bg-zinc-900"
              onPress={() => setValues(defaultValues)}
            >
              <Text className="font-extrabold text-zinc-300">Reset</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="h-12 flex-1 items-center justify-center rounded-xl"
              disabled={isPending || values.name.trim().length < 2}
              onPress={submit}
              style={{ backgroundColor: values.color }}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-extrabold text-white">
                  {isEdit ? "Save" : "Create"}
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

import {
  formatDate,
  type Habit,
  type HabitFormValues,
  type HabitFrequency,
  type SuggestedHabit,
} from "@habitoo/core";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { HabitIconName } from "../../../lib/habits-icon";
import { APP_ACCENT_COLOR } from "../../../shared/constants";
import { DatePickerField } from "../components/date-picker-field";
import { HabitNameField } from "../components/habit-name-field";
import { HabitUnitField } from "../components/habit-unit-field";
import { useCreateHabit } from "../hooks/mutations/use-create-habit";
import { useUpdateHabit } from "../hooks/mutations/use-update-habit";
import { useHabitDetailsData } from "../hooks/queries/use-habit-details-data";
import { colors } from "@/src/shared/theme/colors";

type HabitFormScreenProps = {
  habitId?: string;
  selectedDate?: string;
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

export function HabitFormScreen({
  habitId,
  selectedDate,
}: HabitFormScreenProps) {
  const isEdit = !!habitId;
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const { habit, isLoading, isFetching, error, refetch } =
    useHabitDetailsData(habitId);

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
            color: colors.accent,
          },
    [habit, selectedDate]
  );

  const [values, setValues] = useState<HabitFormValues>(defaultValues);
  const [namePanelOpen, setNamePanelOpen] = useState(false);
  const [unitPanelOpen, setUnitPanelOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pickerOpen = namePanelOpen || unitPanelOpen;

  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

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

    if (isEdit && habitId) {
      updateHabit.mutate({ habitId, values: payload });
      router.back();
      return;
    }

    createHabit.mutate(payload);
    router.back();
  };

  const refreshIntentionally = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  if (isEdit && isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-zinc-950 px-6">
        <ActivityIndicator color={APP_ACCENT_COLOR} size="large" />
        <Text className="mt-4 text-base font-semibold text-zinc-500">
          Loading habit
        </Text>
      </SafeAreaView>
    );
  }

  if (isEdit && (error || !habit)) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 px-6" edges={["top"]}>
        <View className="flex-row items-center pt-4">
          <Pressable
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full bg-zinc-900"
            onPress={() => router.back()}
          >
            <ArrowLeft color="#fff" size={20} />
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-xl font-extrabold text-white">
            Could not load habit
          </Text>
          <Pressable
            accessibilityRole="button"
            className="mt-6 rounded-full bg-zinc-800 px-6 py-3"
            onPress={refetch}
          >
            <Text className="font-extrabold text-white">Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      <View className="border-b border-zinc-800 px-5 py-4">
        <View className="flex-row items-center gap-4">
          <Pressable
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full bg-zinc-900"
            onPress={() => router.back()}
          >
            <ArrowLeft color="#fff" size={20} />
          </Pressable>
          <View className="min-w-0 flex-1">
            <Text className="text-xl font-extrabold text-white">
              {isEdit ? "Edit Habit" : "New Habit"}
            </Text>
            <Text className="mt-1 text-sm font-semibold text-zinc-500">
              {isEdit
                ? "Update your goal and appearance."
                : "Build something small enough to repeat."}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
        overScrollMode="always"
        scrollEnabled={!pickerOpen}
        refreshControl={
          isEdit ? (
            <RefreshControl
              refreshing={refreshing}
              tintColor={APP_ACCENT_COLOR}
              onRefresh={refreshIntentionally}
            />
          ) : undefined
        }
        contentContainerClassName="gap-5 px-5 pb-8 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <HabitNameField
          color={values.color}
          icon={(values.icon as HabitIconName) || "QuestionMark"}
          onColorChange={(color) => setValue("color", color)}
          onIconChange={(icon) => setValue("icon", icon)}
          onNameChange={(text) => setValue("name", text)}
          onPanelOpenChange={setNamePanelOpen}
          onSuggestionSelect={applySuggestion}
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
              onChangeText={(text) => setValue("targetValue", Number(text) || 0)}
              value={String(values.targetValue)}
            />
          </View>
          <View className="flex-1">
            <HabitUnitField
              color={values.color}
              onChange={(text) => setValue("unit", text)}
              onPanelOpenChange={setUnitPanelOpen}
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
                  className={`rounded-lg border px-4 py-2 ${
                    selected
                      ? "border-emerald-400 bg-emerald-500/10"
                      : "border-zinc-800 bg-zinc-900"
                  }`}
                  style={ selected && {borderColor: values.color}}
                  key={frequency.value}
                  onPress={() => setValue("frequency", frequency.value)}
                >
                  <Text
                    className={`font-extrabold`} 
                    style={ selected ? { color: values.color } : { color: colors.muted } }
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

      <View className="flex-row gap-3 border-t border-zinc-800 px-5 py-4">
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
          style={{
            backgroundColor:
              isPending || values.name.trim().length < 2 ? `${values.color}33` : values.color,
          }}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-extrabold text-white"
              style={ isPending || values.name.trim().length < 2 ? { color: colors.muted } : { color: colors.text } }
            >
              {isEdit ? "Save" : "Create"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

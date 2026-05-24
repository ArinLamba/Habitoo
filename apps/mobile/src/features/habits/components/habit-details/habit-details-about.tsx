import { formatDate, formatDisplayDate, type Habit } from "@habitoo/core";
import { memo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useUpdateHabit } from "../../hooks/mutations/use-update-habit";
import { HabitDangerZone } from "./habit-danger-zone";

type HabitDetailsAboutProps = {
  habit: Habit;
  isDeleting?: boolean;
  onDelete: () => void;
};

const formatCreatedInfo = (input?: Date | string) => {
  if (!input) return { date: "—", days: "" };
  const dateStr =
    typeof input === "string"
      ? input.slice(0, 10)
      : formatDate(new Date(input));

  return {
    date: formatDisplayDate(dateStr),
    days: formatRelativeDays(dateStr),
  };
};

const formatRelativeDays = (dateStr: string) => {
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  const days = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

const formatUpdatedInfo = (input?: Date | string) => {
  if (!input) return { line: "—", relative: "" };

  const d = new Date(input);
  const date = d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);

  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  const relative =
    days === 0 ? "Today" : days === 1 ? "1 day ago" : `${days} days ago`;

  return { line: `${date} • ${time}`, relative };
};

function HabitDetailsAboutComponent({
  habit,
  isDeleting,
  onDelete,
}: HabitDetailsAboutProps) {
  const updateHabit = useUpdateHabit();
  const initialDescription = habit.description ?? "";
  const [description, setDescription] = useState(initialDescription);
  const [savedDescription, setSavedDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
    setSavedDescription(initialDescription);
  }, [habit.id, initialDescription]);

  const isDirty = description !== savedDescription;
  const createdInfo = formatCreatedInfo(habit.createdAt);
  const startedInfo = formatCreatedInfo(habit.startDate);
  const updatedInfo = formatUpdatedInfo(habit.updatedAt);

  const handleSave = () => {
    updateHabit.mutate(
      { habitId: habit.id, values: { description } },
      {
        onSuccess: () => setSavedDescription(description),
      }
    );
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-4 p-4 pb-8"
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
          Description
        </Text>
        <TextInput
          className="min-h-[100px] rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-white"
          multiline
          onChangeText={setDescription}
          placeholder="Write about your habit..."
          placeholderTextColor="#71717a"
          textAlignVertical="top"
          value={description}
        />
        <View className="mt-2 flex-row items-center justify-between">
          <Text
            className={`text-xs font-semibold ${
              isDirty ? "text-amber-400" : "text-zinc-500"
            }`}
          >
            {isDirty ? "Unsaved changes" : "Saved"}
          </Text>
          <Pressable
            accessibilityRole="button"
            className="rounded-lg bg-zinc-800 px-4 py-2"
            disabled={updateHabit.isPending || !isDirty}
            onPress={handleSave}
          >
            {updateHabit.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-xs font-extrabold text-white">Save</Text>
            )}
          </Pressable>
        </View>
      </View>

      <View className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <Text className="text-sm font-extrabold text-white">Info</Text>
        <View className="my-3 h-px bg-zinc-800" />

        <InfoRow label="Created at" primary={createdInfo.date} secondary={createdInfo.days} />
        <View className="my-3 h-px bg-zinc-800" />
        <InfoRow label="Started at" primary={startedInfo.date} secondary={startedInfo.days} />
        <View className="my-3 h-px bg-zinc-800" />
        <InfoRow
          label="Updated at"
          primary={updatedInfo.line}
          secondary={updatedInfo.relative}
        />
      </View>

      <HabitDangerZone
        habitName={habit.name}
        isDeleting={isDeleting}
        onDelete={onDelete}
      />
    </ScrollView>
  );
}

function InfoRow({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary: string;
}) {
  return (
    <View className="flex-row justify-between gap-4">
      <Text className="text-xs font-bold text-zinc-400">{label}</Text>
      <View className="items-end">
        <Text className="text-xs font-semibold text-zinc-300">{primary}</Text>
        {secondary ? (
          <Text className="mt-0.5 text-xs text-zinc-500">{secondary}</Text>
        ) : null}
      </View>
    </View>
  );
}

export const HabitDetailsAbout = memo(HabitDetailsAboutComponent);

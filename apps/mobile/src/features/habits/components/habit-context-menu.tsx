import type { Habit } from "@habitoo/core";

import {
  Archive,
  ArrowRight,
  CheckCircle2,
  Pencil,
  Plus,
  X,
  RotateCcw,
  Undo
} from "lucide-react-native";
import { memo, useMemo, type ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import type { HabitSectionKind } from "../utils/group-habits";


export type HabitContextMenuAction =
  | "log-progress"
  | "edit"
  | "skip"
  | "fail"
  | "remove-progress"
  | "end-habit"
  | "archive-habit"
  | "restore-habit";

type MenuItem = {
  key: HabitContextMenuAction;
  label: string;
  icon: ReactNode;
  tone?: "default" | "destructive" | "success";
};

type HabitContextMenuProps = {
  habit: Habit | null;
  open: boolean;
  isDoneForDate: boolean;
  canLog: boolean;
  sectionKind: HabitSectionKind;
  onClose: () => void;
  onSelect: (action: HabitContextMenuAction, habit: Habit) => void;
};

const frequencyLabels: Record<Habit["frequency"], string> = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
  year: "Yearly",
};

function MenuRow({
  item,
  onPress,
}: {
  item: MenuItem;
  onPress: () => void;
}) {
  const textClass =
    item.tone === "destructive"
      ? "text-red-300"
      : item.tone === "success"
        ? "text-emerald-300"
        : "text-white";

  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row items-center gap-3 rounded-xl px-3 py-3 active:bg-zinc-800"
      onPress={onPress}
    >
      {item.icon}
      <Text className={`flex-1 text-[15px] font-bold ${textClass}`}>
        {item.label}
      </Text>
    </Pressable>
  );
}

export const HabitContextMenu = memo(function HabitContextMenu({
  habit,
  open,
  isDoneForDate,
  canLog,
  sectionKind,
  onClose,
  onSelect,
}: HabitContextMenuProps) {
  const items = useMemo(() => {
    if (!habit) return [];

    const list: MenuItem[] = [];

    if (canLog) {
      list.push({
        key: "log-progress",
        label: "Log progress",
        icon: <Plus color="#e4e4e7" size={18} />,
      });
    }

    list.push({
      key: "edit",
      label: "Edit habit",
      icon: <Pencil color="#e4e4e7" size={18} />,
    });

    if (canLog) {
      list.push(
        {
          key: "skip",
          label: "Mark as skipped",
          icon: <ArrowRight color="#a1a1aa" size={18} />,
        },
        {
          key: "fail",
          label: "Mark as failed",
          icon: <X color="#f87171" size={18} />,
          tone: "destructive",
        }
      );
    }

    const canReturnToFrequency =
      canLog &&
      (isDoneForDate || sectionKind === "skipped" || sectionKind === "failed");

    if (canReturnToFrequency) {
      const restoreLabel =
        sectionKind === "skipped" || sectionKind === "failed"
          ? `Move back to ${frequencyLabels[habit.frequency]}`
          : "Remove progress";

      list.push({
        key: "remove-progress",
        label: restoreLabel,
        icon: <Undo color="#60a5fa" size={18} />,
      });
    }

    if (habit.lifecycle === "active") {
      list.push(
        {
          key: "end-habit",
          label: "End habit",
          icon: <CheckCircle2 color="#34d399" size={18} />,
          tone: "success",
        },
        {
          key: "archive-habit",
          label: "Archive habit",
          icon: <Archive color="#a1a1aa" size={18} />,
        }
      );
    } else {
      list.push({
        key: "restore-habit",
        label: "Restore habit",
        icon: <RotateCcw color="#eab308" size={18} />,
      });
    }

    return list;
  }, [canLog, habit, isDoneForDate, sectionKind]);

  if (!habit) return null;

  const pick = (action: HabitContextMenuAction) => {
    onClose();
    onSelect(action, habit);
  };

  return (
    <Modal animationType="fade" transparent visible={open} onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center bg-black/60 px-8" onPress={onClose}>
        <Pressable
          className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-zinc-800 px-4 py-3">
            <View className="min-w-0 flex-1 pr-2">
              <Text className="text-[11px] font-extrabold uppercase text-zinc-500">
                Habit options
              </Text>
              <Text className="mt-0.5 text-base font-extrabold text-white" numberOfLines={1}>
                {habit.name}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              className="h-8 w-8 items-center justify-center rounded-full bg-zinc-900"
              onPress={onClose}
            >
              <X color="#a1a1aa" size={16} />
            </Pressable>
          </View>

          <View className="p-1">
            {items.map((item, index) => (
              <View key={item.key}>
                {index > 0 &&
                (item.key === "end-habit" || item.key === "restore-habit") ? (
                  <View className="my-1 h-px bg-zinc-800" />
                ) : null}
                <MenuRow item={item} onPress={() => pick(item.key)} />
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

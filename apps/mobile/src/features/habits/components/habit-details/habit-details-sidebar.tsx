import type { Habit, Completion } from "@habitoo/core";
import { X } from "lucide-react-native";
import { memo } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HabitDetailsPanel } from "./habit-details-panel";

type HabitDetailsSidebarProps = {
  habit: Habit;
  logs: Completion[];
  open: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export const HabitDetailsSidebar = memo(function HabitDetailsSidebar({
  habit,
  logs,
  open,
  isDeleting,
  onClose,
  onDelete,
}: HabitDetailsSidebarProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="fade" transparent visible={open} onRequestClose={onClose}>
      <View className="flex-1 flex-row">
        <Pressable accessibilityRole="button" className="flex-1 bg-black/55" onPress={onClose} />

        <View
          className="h-full w-[82%] max-w-[320px] border-l border-zinc-800 bg-zinc-950"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
          <View className="flex-row items-center justify-between border-b border-zinc-800 px-4 py-3">
            <Text className="text-sm font-extrabold text-white">Habit panel</Text>
            <Pressable
              accessibilityRole="button"
              className="h-9 w-9 items-center justify-center rounded-full bg-zinc-900"
              onPress={onClose}
            >
              <X color="#a1a1aa" size={18} />
            </Pressable>
          </View>

          <View className="flex-1 p-3">
            <HabitDetailsPanel
              habit={habit}
              isDeleting={isDeleting}
              logs={logs}
              onDelete={onDelete}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
});

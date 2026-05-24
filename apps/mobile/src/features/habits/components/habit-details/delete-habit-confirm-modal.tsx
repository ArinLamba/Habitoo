import { X } from "lucide-react-native";
import { memo } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

type DeleteHabitConfirmModalProps = {
  habitName: string;
  open: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteHabitConfirmModal = memo(function DeleteHabitConfirmModal({
  habitName,
  open,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteHabitConfirmModalProps) {
  return (
    <Modal animationType="fade" transparent visible={open} onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center bg-black/70 px-8" onPress={onClose}>
        <Pressable
          className="overflow-hidden rounded-2xl border border-red-900/50 bg-zinc-950 shadow-2xl"
          onPress={(event) => event.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-zinc-800 px-4 py-3">
            <View className="min-w-0 flex-1 pr-2">
              <Text className="text-[11px] font-extrabold uppercase text-red-400">
                Delete habit
              </Text>
              <Text className="mt-0.5 text-base font-extrabold text-white" numberOfLines={1}>
                {habitName}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              className="h-8 w-8 items-center justify-center rounded-full bg-zinc-900"
              disabled={isDeleting}
              onPress={onClose}
            >
              <X color="#a1a1aa" size={16} />
            </Pressable>
          </View>

          <View className="p-4">
            <Text className="text-sm font-semibold leading-5 text-zinc-400">
              This will permanently remove the habit, its logs, and all stats.
            </Text>

            <View className="mt-5 flex-row gap-2">
              <Pressable
                accessibilityRole="button"
                className="h-11 flex-1 items-center justify-center rounded-xl bg-zinc-900"
                disabled={isDeleting}
                onPress={onClose}
              >
                <Text className="font-extrabold text-zinc-300">Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-red-600"
                disabled={isDeleting}
                onPress={onConfirm}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <X color="#fff" size={16} strokeWidth={3} />
                    <Text className="font-extrabold text-white">Delete</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

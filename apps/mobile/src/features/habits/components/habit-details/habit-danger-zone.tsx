import { X } from "lucide-react-native";
import { memo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type HabitDangerZoneProps = {
  habitName: string;
  isDeleting?: boolean;
  onDelete: () => void;
};

export const HabitDangerZone = memo(function HabitDangerZone({
  habitName,
  isDeleting,
  onDelete,
}: HabitDangerZoneProps) {
  return (
    <View className="mt-2 rounded-2xl border border-red-900/40 bg-red-950/20 p-5">
      <Text className="text-xs font-extrabold uppercase text-red-400/90">
        Danger zone
      </Text>
      <Text className="mt-2 text-sm leading-5 text-zinc-400">
        Permanently delete &quot;{habitName}&quot; and all of its logs. This cannot
        be undone.
      </Text>
      <Pressable
        accessibilityRole="button"
        className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-red-800/60 bg-red-950/60 py-3.5"
        disabled={isDeleting}
        onPress={onDelete}
      >
        {isDeleting ? (
          <ActivityIndicator color="#f87171" />
        ) : (
          <>
            <X color="#f87171" size={18} />
            <Text className="text-base font-extrabold text-red-300">
              Delete habit
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
});

import { HABIT_STATUS, type Habit, type HabitStatus } from "@habitoo/core";
import { ArrowRight, CheckCircle2, Plus, X } from "lucide-react-native";
import { memo, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type CalendarDayActionModalProps = {
  habit: Habit;
  date: string | null;
  open: boolean;
  remaining: number;
  current: number;
  isSaving?: boolean;
  onClose: () => void;
  onFillRemaining: (date: string, value: number) => void;
  onAddLog: (date: string, value: number) => void;
  onSetStatus: (date: string, status: HabitStatus) => void;
};

type MenuRowProps = {
  icon: ReactNode;
  label: string;
  detail?: string;
  tone?: "default" | "destructive" | "success";
  disabled?: boolean;
  onPress: () => void;
};

function MenuRow({
  icon,
  label,
  detail,
  tone = "default",
  disabled,
  onPress,
}: MenuRowProps) {
  const textClass =
    tone === "destructive"
      ? "text-red-300"
      : tone === "success"
        ? "text-emerald-300"
        : "text-white";

  return (
    <Pressable
      accessibilityRole="button"
      className={`flex-row items-center gap-3 rounded-xl px-3 py-3 ${
        disabled ? "opacity-40" : "active:bg-zinc-800"
      }`}
      disabled={disabled}
      onPress={onPress}
    >
      {icon}
      <Text className={`flex-1 text-[15px] font-bold ${textClass}`}>
        {label}
      </Text>
      {detail ? (
        <Text className="text-xs font-bold text-zinc-500">{detail}</Text>
      ) : null}
    </Pressable>
  );
}

export const CalendarDayActionModal = memo(function CalendarDayActionModal({
  habit,
  date,
  open,
  remaining,
  current,
  isSaving,
  onClose,
  onFillRemaining,
  onAddLog,
  onSetStatus,
}: CalendarDayActionModalProps) {
  const unit = habit.unit || "times";
  const [value, setValue] = useState("1");

  useEffect(() => {
    if (open) {
      setValue(remaining > 0 ? Math.min(1, remaining).toString() : "1");
    }
  }, [open, remaining]);

  const suggestions = useMemo(() => {
    const values = [1, remaining, habit.targetValue].filter(
      (item, index, arr) =>
        Number.isFinite(item) && item > 0 && arr.indexOf(item) === index
    );

    return values.slice(0, 3);
  }, [habit.targetValue, remaining]);

  if (!date) return null;

  const numericValue = Math.max(0, Number(value) || 0);

  const submit = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={open} onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center bg-black/65 px-7" onPress={onClose}>
        <Pressable
          className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
          onPress={(event) => event.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-zinc-800 px-4 py-3">
            <View className="min-w-0 flex-1 pr-2">
              <Text className="text-[11px] font-extrabold uppercase text-zinc-500">
                Calendar day
              </Text>
              <Text className="mt-0.5 text-base font-extrabold text-white" numberOfLines={1}>
                {date}
              </Text>
              <Text className="mt-1 text-xs font-semibold text-zinc-500">
                {current}/{habit.targetValue} {unit}
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
            <MenuRow
              detail={remaining > 0 ? `${remaining} ${unit}` : undefined}
              disabled={remaining <= 0 || isSaving}
              icon={<CheckCircle2 color="#34d399" size={18} />}
              label="Fill remaining"
              tone="success"
              onPress={() =>
                submit(() => onFillRemaining(date, remaining))
              }
            />

            <View className="mx-3 my-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <View className="mb-2 flex-row items-center gap-2">
                <Plus color="#e4e4e7" size={16} />
                <Text className="text-sm font-extrabold text-white">Add log</Text>
              </View>

              <View className="flex-row gap-2">
                {suggestions.map((suggestion) => (
                  <Pressable
                    accessibilityRole="button"
                    className="rounded-full border border-zinc-700 px-3 py-1.5 active:bg-zinc-800"
                    key={suggestion}
                    disabled={isSaving}
                    onPress={() => setValue(suggestion.toString())}
                  >
                    <Text className="text-xs font-extrabold text-zinc-300">
                      {suggestion} {unit}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View className="mt-3 flex-row gap-2">
                <TextInput
                  className="h-11 flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-center text-lg font-extrabold text-white"
                  editable={!isSaving}
                  keyboardType="decimal-pad"
                  onChangeText={setValue}
                  value={value}
                />
                <Pressable
                  accessibilityRole="button"
                  className="h-11 min-w-[86px] flex-row items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3"
                  disabled={isSaving || numericValue <= 0}
                  onPress={() =>
                    submit(() => onAddLog(date, numericValue))
                  }
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Plus color="#fff" size={15} strokeWidth={3} />
                      <Text className="font-extrabold text-white">Save</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>

            <MenuRow
              disabled={isSaving}
              icon={<ArrowRight color="#a1a1aa" size={18} />}
              label="Mark as skipped"
              onPress={() =>
                submit(() => onSetStatus(date, HABIT_STATUS.SKIPPED))
              }
            />
            <MenuRow
              disabled={isSaving}
              icon={<X color="#f87171" size={18} />}
              label="Mark as failed"
              tone="destructive"
              onPress={() =>
                submit(() => onSetStatus(date, HABIT_STATUS.FAILED))
              }
            />
            <View className="my-1 h-px bg-zinc-800" />
            <MenuRow
              disabled={isSaving}
              icon={<X color="#fbbf24" size={18} />}
              label="Clear logs"
              onPress={() => submit(() => onSetStatus(date, null))}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

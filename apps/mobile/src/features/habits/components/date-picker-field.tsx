import { formatDate, parseLocalDate } from "@habitoo/core";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react-native";
import { memo, useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

type DatePickerFieldProps = {
  label: string;
  value: string;
  onChange: (date: string) => void;
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const getCalendarDays = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<Date | null> = Array.from({ length: startOffset }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
};

export const DatePickerField = memo(function DatePickerField({
  label,
  value,
  onChange,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => parseLocalDate(value));
  const days = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const monthLabel = visibleMonth.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  const moveMonth = (amount: number) => {
    setVisibleMonth((current) => {
      const next = new Date(current);
      next.setMonth(next.getMonth() + amount, 1);
      return next;
    });
  };

  const openPicker = () => {
    setVisibleMonth(parseLocalDate(value));
    setOpen(true);
  };

  return (
    <View>
      <Text className="mb-2 text-xs font-extrabold uppercase text-zinc-500">
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        className="flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
        onPress={openPicker}
      >
        <Text className="text-base font-bold text-white">{value}</Text>
        <CalendarDays color="#a1a1aa" size={18} />
      </Pressable>

      <Modal animationType="fade" transparent visible={open} onRequestClose={() => setOpen(false)}>
        <View className="flex-1 justify-center bg-black/70 px-5">
          <View className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Pressable
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-full bg-zinc-900"
                onPress={() => moveMonth(-1)}
              >
                <ChevronLeft color="#d4d4d8" size={19} />
              </Pressable>
              <Text className="text-base font-extrabold text-white">{monthLabel}</Text>
              <Pressable
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-full bg-zinc-900"
                onPress={() => moveMonth(1)}
              >
                <ChevronRight color="#d4d4d8" size={19} />
              </Pressable>
            </View>

            <View className="mb-2 flex-row">
              {weekDays.map((day) => (
                <Text
                  className="flex-1 text-center text-xs font-extrabold uppercase text-zinc-500"
                  key={day}
                >
                  {day}
                </Text>
              ))}
            </View>

            <View className="flex-row flex-wrap">
              {days.map((date, index) => {
                const dateValue = date ? formatDate(date) : "";
                const selected = dateValue === value;

                return (
                  <View className="w-[14%] p-1" key={`${dateValue}-${index}`}>
                    {date ? (
                      <Pressable
                        accessibilityRole="button"
                        className={`h-10 items-center justify-center rounded-full ${
                          selected ? "bg-emerald-500" : "bg-zinc-900"
                        }`}
                        onPress={() => {
                          onChange(dateValue);
                          setOpen(false);
                        }}
                      >
                        <Text
                          className={`text-sm font-extrabold ${
                            selected ? "text-white" : "text-zinc-300"
                          }`}
                        >
                          {date.getDate()}
                        </Text>
                      </Pressable>
                    ) : (
                      <View className="h-10" />
                    )}
                  </View>
                );
              })}
            </View>

            <View className="mt-4 flex-row gap-3">
              <Pressable
                accessibilityRole="button"
                className="h-11 flex-1 items-center justify-center rounded-xl bg-zinc-900"
                onPress={() => setOpen(false)}
              >
                <Text className="font-extrabold text-zinc-300">Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                className="h-11 flex-1 items-center justify-center rounded-xl bg-emerald-500"
                onPress={() => {
                  onChange(formatDate(new Date()));
                  setOpen(false);
                }}
              >
                <Text className="font-extrabold text-white">Today</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

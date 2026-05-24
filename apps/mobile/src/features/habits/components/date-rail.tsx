import { addDays, formatDate, parseLocalDate } from "@habitoo/core";
import { Plus } from "lucide-react-native";
import { memo, useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type DateRailProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onAddHabit: () => void;
};

export const DateRail = memo(function DateRail({
  selectedDate,
  onSelectDate,
  onAddHabit,
}: DateRailProps) {
  const days = useMemo(() => {
    const today = formatDate(new Date());

    return Array.from({ length: 31 }, (_, index) => {
      const date = addDays(today, index - 30);
      const parsed = parseLocalDate(date);

      return {
        date,
        weekday: parsed
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase(),
        day: parsed.getDate().toString(),
      };
    });
  }, []);

  return (
    <View className="border-t border-zinc-800 bg-zinc-900/95 py-2">
      <View className="flex-row items-center gap-x-4 px-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3"
        >
          {days.map((day,index) => {
            const selected = day.date === selectedDate;

            return (
              <Pressable
                accessibilityRole="button"
                className={`h-[50px] w-[42px] items-center justify-center rounded-lg ${
                  selected ? "bg-zinc-700" : "bg-transparent"
                }`}
                key={`${day.date}-${index}`}
                onPress={() => onSelectDate(day.date)}
              >
                <Text
                  className={`text-xs font-extrabold ${
                    selected ? "text-white" : "text-zinc-500"
                  }`}
                >
                  {day.weekday}
                </Text>
                <Text
                  className={`mt-1 text-lg font-extrabold ${
                    selected ? "text-white" : "text-zinc-500"
                  }`}
                >
                  {day.day}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="h-10 w-px bg-zinc-700" />

        <Pressable
          accessibilityRole="button"
          className="h-[44px] w-[44px] items-center justify-center rounded-full bg-[#1c6f51] shadow-lg"
          onPress={onAddHabit}
        >
          <Plus color="white" size={22} strokeWidth={3} />
        </Pressable>
      </View>
    </View>
  );
});

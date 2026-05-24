import {
  getLongestBreak,
  getMostActiveDay,
  getSmartInsight,
  HABIT_STATUS,
  type Completion,
} from "@habitoo/core";
import { useMemo } from "react";
import { Text, View } from "react-native";

export function PatternRead({ completions }: { completions: Completion[] }) {
  const { insight, longestBreak, mostActive } = useMemo(() => {
    const dates = completions
      .filter((completion) => completion.status === HABIT_STATUS.COMPLETED)
      .map((completion) => completion.date);

    return {
      insight: getSmartInsight(completions),
      longestBreak: getLongestBreak(dates),
      mostActive: getMostActiveDay(completions),
    };
  }, [completions]);

  const [day, count] = mostActive || [];

  return (
    <View className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/80 p-4">
      <Text className="text-xs font-extrabold uppercase text-zinc-500">
        Pattern read
      </Text>
      <Text className="mt-4 text-base font-bold leading-6 text-white">
        {insight}
      </Text>
      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-md bg-zinc-800 p-3">
          <Text className="text-xs font-semibold text-zinc-500">Longest break</Text>
          <Text className="mt-1 text-base font-extrabold text-white">
            {longestBreak} days
          </Text>
        </View>
        <View className="flex-1 rounded-md bg-zinc-800 p-3">
          <Text className="text-xs font-semibold text-zinc-500">Most active</Text>
          <Text className="mt-1 text-base font-extrabold text-white">
            {day ? `${day} (${count})` : "No data"}
          </Text>
        </View>
      </View>
    </View>
  );
}

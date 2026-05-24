import type { Habit } from "@habitoo/core";
import { ArrowRight, Check, Flame, X } from "lucide-react-native";
import { View } from "react-native";

import { StatCard } from "./stat-card";
import type { HabitAnalytics } from "./types";

type HabitStatsSummaryProps = {
  analytics: HabitAnalytics;
  habit: Habit;
};

export function HabitStatsSummary({ analytics, habit }: HabitStatsSummaryProps) {
  const completed = analytics.calendar.sets.completed.size;
  const failed = analytics.calendar.sets.failed.size;
  const skipped = analytics.calendar.sets.skipped.size;
  const total = analytics.charts.day.reduce((sum, item) => sum + item.value, 0);

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <StatCard
          icon={<Check color="#71717a" size={15} />}
          label="Complete"
          trend={completed > 0 ? `up ${completed}d` : undefined}
          value={`${completed} days`}
        />
        <StatCard
          icon={<X color="#71717a" size={15} />}
          label="Failed"
          value={`${failed} days`}
        />
      </View>
      <View className="flex-row gap-3">
        <StatCard
          icon={<ArrowRight color="#a1a1aa" size={15} />}
          label="Skipped"
          value={`${skipped} days`}
        />
        <StatCard
          icon={<Flame color="#71717a" size={15} />}
          label="Total"
          trend={total > 0 ? `up ${total} ${habit.unit || "times"}` : undefined}
          value={`${total} ${habit.unit || "times"}`}
        />
      </View>
    </View>
  );
}

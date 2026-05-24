import {
  formatDate,
  HABIT_STATUS,
  type Completion,
  type Habit,
} from "@habitoo/core";
import { Activity, CalendarDays, CheckCircle2, Target } from "lucide-react-native";
import { View } from "react-native";

import { StatCard } from "./stat-card";

type StatsOverviewProps = {
  habits: Habit[];
  completions: Completion[];
};

export function StatsOverview({ habits, completions }: StatsOverviewProps) {
  const activeHabits = habits.filter((habit) => habit.lifecycle === "active");
  const today = formatDate(new Date());
  const currentMonth = today.slice(0, 7);
  const total = completions.length;
  const done = completions.filter(
    (item) => item.status === HABIT_STATUS.COMPLETED
  ).length;
  const doneToday = new Set(
    completions
      .filter((item) => item.date === today && item.status === HABIT_STATUS.COMPLETED)
      .map((item) => item.habitId)
  ).size;
  const monthLogs = completions.filter((item) =>
    item.date.startsWith(currentMonth)
  ).length;
  const rate = total === 0 ? 0 : Math.round((done / total) * 100);
  const totalDays = new Set(completions.map((item) => item.date)).size;

  return (
    <View className="mt-5 flex-row flex-wrap justify-between gap-y-3">
      <StatCard
        label="Active habits"
        value={`${activeHabits.length}`}
        helper={`${habits.length} total tracked`}
        icon={Target}
      />
      <StatCard
        label="Done today"
        value={`${doneToday}`}
        helper={`${activeHabits.length} possible`}
        icon={CheckCircle2}
      />
      <StatCard
        label="Month logs"
        value={`${monthLogs}`}
        helper="logged this month"
        icon={Activity}
      />
      <StatCard
        label="Active days"
        value={`${totalDays}`}
        helper={`${rate}% completion signal`}
        icon={CalendarDays}
      />
    </View>
  );
}

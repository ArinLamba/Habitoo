"use client";
import { getHabitStreaks } from "@/lib/streaks";
import { formatDate } from "@/lib/date";

import { useHabits } from "@/hooks/queries/use-habits";
import { useCompletions } from "@/hooks/queries/use-completions";

import { useHabitStore } from "@/store/use-habit-store";

export const useHabitStats = () => {
  const selectedHabitId = useHabitStore((s) => s.selectedHabitId);
  const { data: habits = [] } = useHabits();


  const { data: completions = [] } = useCompletions();

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  if (!selectedHabit) return null;

  // rest stays SAME

  const createdDate = new Date(selectedHabit.createdAt!);
  if (isNaN(createdDate.getTime())) return null;

  createdDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = formatDate(today);
  const habitStartDate = formatDate(createdDate);

  // 🔥 streaks
  const { currentStreak, bestStreak } = getHabitStreaks(
    selectedHabit.id,
    completions
  );
  

  // 📊 consistency
  const totalDays =
    Math.floor(
      (today.getTime() - createdDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const doneDaysSet = new Set(
    completions
      .filter(
        (c) =>
          c.habitId === selectedHabit.id &&
          c.completed &&
          c.date >= habitStartDate &&
          c.date <= todayStr
      )
      .map((c) => c.date)
  );

  const consistency = totalDays
    ? Math.round((doneDaysSet.size / totalDays) * 100)
    : 0;

  // 📅 week
  const habitCompletions = completions.filter(
    (c) => c.habitId === selectedHabit.id
  );

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return formatDate(d);
  });

  const weekDone = habitCompletions.filter(
    (c) =>
      last7Days.includes(c.date) &&
      c.completed &&
      c.date <= todayStr
  ).length;

  // ⏱️ last done
  const lastDone = [...habitCompletions]
    .filter((c) => c.completed && c.date <= todayStr)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  const lastDoneText = lastDone
    ? formatDisplayDate(lastDone.date)
    : "Never";

  // 🧠 insight
  const insight =
    consistency > 80
      ? "You're doing great 🔥"
      : consistency > 50
      ? "You're consistent, but can improve"
      : "Needs attention ⚠️";

  return {
    consistency,
    currentStreak,
    bestStreak,
    weekDone,
    lastDoneText,
    insight,
    habitStartDate,
  };
};

// helper
const formatDisplayDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("default", {
    day: "numeric",
    month: "short",
  });
};
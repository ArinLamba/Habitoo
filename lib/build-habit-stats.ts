import { formatDisplayDate } from "@/lib/date";
import { formatDate } from "./date";
import { getHabitStreaks } from "./streaks";
import { Completion, Habit, HABIT_STATUS, HabitStatus } from "./types";

export const buildHabitStats = (habit: Habit, completions: Completion[]) => {
      if (!habit) return null;
    
    // rest stays SAME

    const createdDate = new Date(habit.createdAt!);
    if (isNaN(createdDate.getTime())) return null;
    
    createdDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStr = formatDate(today);
    const habitStartDate = formatDate(createdDate);

    // 🔥 streaks
    const { currentStreak, bestStreak } = getHabitStreaks(
      habit.id,
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
            c.habitId === habit.id &&
            c.status === HABIT_STATUS.COMPLETED &&
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
      (c) => c.habitId === habit.id
    );

    const completionMap = new Map<string, HabitStatus>();

    for (const c of habitCompletions) {
      completionMap.set(c.date, c.status);
    }

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return formatDate(d);
    });

    const weekDone = habitCompletions.filter(
      (c) =>
        last7Days.includes(c.date) &&
        c.status === HABIT_STATUS.COMPLETED &&
        c.date <= todayStr
    ).length;

    // ⏱️ last done
    const lastDone = [...habitCompletions]
      .filter((c) => c.status === HABIT_STATUS.COMPLETED && c.date <= todayStr)
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
      completionMap,
    };
}
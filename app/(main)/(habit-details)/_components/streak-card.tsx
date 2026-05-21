
import { formatDate } from "@/lib/date";
import { getPeriodDates } from "@/lib/habits/progress";
import { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import { SubtleGrid } from "@/app/(main)/(habit-details)/_components/subtle-grid";

type Props = {
  frequency: Habit["frequency"];
  color: string;
  currentStreak: number;
  calendar: {
    completed: Set<string>;
    skipped: Set<string>;
    failed: Set<string>;
  };
};

export const StreakCard = ({
  frequency,
  color,
  currentStreak,
  calendar,
} : Props) => {

  const { title, message } = getStreakMessage(currentStreak);
  const frequencyLabel =
    frequency === "day"
      ? "day"
      : frequency === "week"
      ? "week"
      : frequency === "month"
      ? "month"
      : "year";
  
  const railItems = getRailItems(frequency, calendar);
  const completedCount = railItems.filter((item) => item.isDone).length;
  const startLabel = railItems[0]?.label ?? "";
  const endLabel = railItems[railItems.length - 1]?.label ?? "";

  return (
    <div className="relative flex  h-full flex-col overflow-hidden rounded-md border border-white/10 dark:bg-zinc-900 px-4 py-5 bg-white">
      <SubtleGrid />
      <div
        className="absolute left-1/2 top-8 h-44 w-44 -translate-x-1/2 rounded-full blur-3xl bg-amber-500/10"
        // style={{ backgroundColor: `${color}20` }}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative mb-2 h-36 w-36">
          <Flame
            className="absolute inset-0 h-full w-full fill-orange-300 text-orange-300 drop-shadow"
            strokeWidth={1.5}
          />
          <div
            className="absolute inset-x-0 bottom-1 text-center  text-7xl font-black leading-none tracking-normal text-zinc-950"
            style={{
              textShadow: "0 2px 0 rgba(255,255,255,0.30)",
            }}
          >
            {currentStreak}
          </div>
        </div>

        <p className="text-xl font-semibold leading-none text-white">
          {frequencyLabel} streak
        </p>

        <h2 className="mt-3 max-w-[230px] text-sm font-medium text-zinc-300">
          {title}
        </h2>

        <p className="mt-1 max-w-[250px] text-sm leading-snug text-zinc-500">
          {message}
        </p>
      </div>

      <div className="relative z-10 mt-5 w-full">
        <div className="flex items-center gap-1.5">
        {railItems.map((item) => {
          return (
            <div
              key={item.key}
              title={item.title}
              className={cn(
                "h-1.5 flex-1 rounded-full bg-zinc-700 transition",
                item.isDone && "bg-orange-300",
                item.isSkipped && "bg-zinc-500",
                item.isFailed && "bg-red-400"
              )}
            />
          );
        })}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs font-semibold text-white">
          <span>{startLabel}</span>
          <span>
            {completedCount}/{railItems.length}
          </span>
          <span>{endLabel}</span>
        </div>
      </div>
    </div>
  );
};

const railLengthByFrequency: Record<Habit["frequency"], number> = {
  day: 7,
  week: 7,
  month: 6,
  year: 5,
};

const getWeekNumber = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays =
    (date.getTime() - firstDay.getTime()) / 86400000;

  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
};

const hasDateInRange = (
  dates: Set<string>,
  start: string,
  end: string
) => {
  for (const date of dates) {
    if (date >= start && date <= end) return true;
  }

  return false;
};

const getRailLabel = (
  frequency: Habit["frequency"],
  date: Date
) => {
  if (frequency === "day") {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  if (frequency === "week") {
    return `W${getWeekNumber(date)}`;
  }

  if (frequency === "month") {
    return date.toLocaleDateString("en-US", { month: "short" });
  }

  return date.getFullYear().toString();
};

const getRailTitle = (
  frequency: Habit["frequency"],
  start: string,
  end: string
) => {
  if (frequency === "day") return start;

  return `${start} - ${end}`;
};

const getRailItems = (
  frequency: Habit["frequency"],
  calendar: Props["calendar"]
) => {
  const count = railLengthByFrequency[frequency];
  const today = new Date();

  return [...Array(count)].map((_, index) => {
    const offset = count - 1 - index;
    const date = new Date(today);

    if (frequency === "day") {
      date.setDate(today.getDate() - offset);
    }

    if (frequency === "week") {
      date.setDate(today.getDate() - offset * 7);
    }

    if (frequency === "month") {
      date.setMonth(today.getMonth() - offset);
    }

    if (frequency === "year") {
      date.setFullYear(today.getFullYear() - offset);
    }

    const dateStr = formatDate(date);
    const { start, end } = getPeriodDates(frequency, dateStr);

    return {
      key: `${frequency}-${start}`,
      label: getRailLabel(frequency, date),
      title: getRailTitle(frequency, start, end),
      isDone: hasDateInRange(calendar.completed, start, end),
      isSkipped: hasDateInRange(calendar.skipped, start, end),
      isFailed: hasDateInRange(calendar.failed, start, end),
    };
  });
};


const pickRandom = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};


const getStreakMessage = (streak: number) => {
  if (streak === 0) {
    return {
      title: "Start your streak today 🔥",
      message: pickRandom([
        "Every expert was once a beginner. Start now.",
        "One small action is enough to begin.",
        "Today is a good day to start fresh.",
      ]),
    };
  }

  if (streak <= 2) {
    return {
      title: "Good start 👏",
      message: pickRandom([
        "Nice! You’ve started building momentum.",
        "Keep going tomorrow to lock it in.",
        "Small start, big future.",
      ]),
    };
  }

  if (streak <= 5) {
    return {
      title: "Building consistency ⚡",
      message: pickRandom([
        "Don’t break the chain now.",
        "You’re forming a real habit.",
        "Consistency is starting to show.",
      ]),
    };
  }

  if (streak <= 10) {
    return {
      title: "On fire 🔥",
      message: pickRandom([
        "You’re getting seriously consistent.",
        "This is where habits stick.",
        "Momentum is building fast.",
      ]),
    };
  }

  if (streak <= 20) {
    return {
      title: "Strong discipline 💪",
      message: pickRandom([
        "Most people quit before this point.",
        "You’re proving real discipline.",
        "This is becoming your routine.",
      ]),
    };
  }

  return {
    title: "Legendary streak 👑",
    message: pickRandom([
      "This habit is part of your identity now.",
      "You’ve built elite-level consistency.",
      "Incredible discipline over time.",
    ]),
  };
};

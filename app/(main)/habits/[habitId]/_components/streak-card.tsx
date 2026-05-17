
import { formatDate } from "@/lib/date";
import { HABIT_STATUS, HabitStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Flame, X } from "lucide-react";
import { SubtleGrid } from "@/components/subtle-grid";

type Props = {
  currentStreak: number;
  calendar: {
    completed: Set<string>;
    skipped: Set<string>;
    failed: Set<string>;
  };
};

export const StreakCard = ({ currentStreak, calendar } : Props) => {

  const { title, message } = getStreakMessage(currentStreak);
  
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  return (
    <div className="relative flex h-full flex-col items-center justify-between py-3">
      <SubtleGrid opacity={0.04}/>
      <div className="absolute  left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-orange-400/10 blur-3xl" />
      {/* Top */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 rounded-full bg-orange-500/10 p-4">
          <Flame className="h-10 w-10 fill-orange-400 text-orange-400" />
        </div>

        <h1 className="text-6xl font-bold tracking-tight">
          {currentStreak}
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          day streak
        </p>

        <h2 className="mt-2 text-center text-sm font-medium text-zinc-300">
          {title}
        </h2>

        <p className="mt- max-w-[220px] text-center text-sm leading-relaxed text-zinc-500">
          {message}
        </p>
      </div>

      {/* Bottom */}
      <div className="mt-8 flex gap-3">
        {last7Days.map((date) => {
          const dateStr = formatDate(date);
          const dayLabel = date.toLocaleDateString("en-US", {
            weekday: "short",
          });

          const isDone = calendar.completed.has(dateStr);
          const isSkipped = calendar.skipped.has(dateStr);
          const isFailed = calendar.failed.has(dateStr);

          const icon =
            isSkipped ? <ArrowRight className="h-4 w-4 text-zinc-300 stroke-2.5" /> :
            isFailed ? <X className="h-4 w-4 text-red-400 stroke-3" /> :
            null;

          return (
            <div
              key={dateStr}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-full transition flex items-center justify-center ",
                  isDone && "bg-orange-400",
                  !isDone && "bg-zinc-700"
                )}
              >
                {icon}
              </div>

              <span className="text-xs text-zinc-500">
                {dayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
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


import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { ArrowRight, X } from "lucide-react";


type Sets = {
  completed: Set<string>;
  skipped: Set<string>;
  failed: Set<string>;
};

type Props = {
  color: string;
  calendar: Sets;
};

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

function MonthGrid({
  year,
  month,
  calendar,
  color,
}: {
  year: number;
  month: number;
  calendar: Sets;
  color: string;
}) {
  const { completed, skipped, failed } = calendar;

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const days: (Date | null)[] = [];

  const cursor = new Date(start);

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  // padding for first week
  const offset = start.getDay();
  for (let i = 0; i < offset; i++) {
    days.unshift(null);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isFuture = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d > today;
  };

  return (
    <div className="space-y-1">
      <div className="text-[12px] text-zinc-400 text-center mb-1">
        {start.toLocaleString("default", { month: "short" })}
      </div>

      {/* weekdays */}
      <div className="grid grid-cols-7 text-[10px] text-zinc-500 font-bold">
        {weekDays.map((d, i) => (
          <div key={i} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* grid */}
      <div className="grid grid-cols-7 ">
        {days.map((date, i) => {
          if (!date) {
            return <div key={i} className="h-5 w-5" />;
          }

          const key = formatDate(date);

          const isCompleted = completed.has(key);
          const isSkipped = skipped.has(key);
          const isFailed = failed.has(key);

          const isToday = date.getDate() === today.getDate()
        

          

          return (
            <button
              key={i}
              className={cn(
                "h-7 w-7 lg:w-13 my-px flex items-center justify-center lg:text-[10px] text-[8px] ",
                isFuture(date) && "opacity-20",
                isToday && "rounded-r-lg"
              )}
              style={isCompleted ? { backgroundColor: color} : undefined}
            >
              {isSkipped ? (
                <ArrowRight size={14} color={color}/>
              ) : (
                isFailed ? (
                  <X size={14} color="red"/>
                ) : (
                  date.getDate()
                )
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const HabitCalendar = ({ color, calendar }: Props) => {
  const now = new Date();

  const currentMonth = {
    year: now.getFullYear(),
    month: now.getMonth(),
  };

  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const prevMonth = {
    year: prevMonthDate.getFullYear(),
    month: prevMonthDate.getMonth(),
  };

  return (
    <div className="">
      <div className="flex gap-4 items-start justify-center bg-amber-80">
        <MonthGrid {...prevMonth} calendar={calendar} color={color} />
        <MonthGrid {...currentMonth} calendar={calendar} color={color}/>
      </div>
    </div>
  );
};
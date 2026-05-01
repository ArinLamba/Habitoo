"use client";

import { Button } from "@/components/ui/button";
import { formatDate, getIsFuture } from "@/lib/date";
import { useDateStore } from "@/store/use-date-store";

type Props = {
  perfectDaysSet: Set<string>;
};

export const Header = ({ perfectDaysSet }: Props) => {

  const { currentDate, setCurrentDate } = useDateStore();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);


  const realToday = new Date();

  return (
    <div>
      

      <div className="grid grid-cols-31 p gap-x-9 mb-4 mt-1">
        {days.map((day) => {
          const dateObj = new Date(year, month, day);
          const date = formatDate(dateObj);

          const isToday =
            day === realToday.getDate() &&
            month === realToday.getMonth() &&
            year === realToday.getFullYear();

          const isSelected =
            day === currentDate.getDate() &&
            month === currentDate.getMonth() &&
            year === currentDate.getFullYear();

            const isFuture = getIsFuture(date);
            const isPerfect = !isFuture && perfectDaysSet.has(date);

          return (
            <Button
              key={day}
              className={`text-xs cursor-pointer px-3 h-7 w-7 rounded-full ${
                isSelected
                  ? "bg-zinc-800 dark:bg-white border-0 font-bold "
                  : isToday
                  ? "border-2 border-black/50 dark:border-white/50 bg-transparent dark:text-white text-black"
                  : isPerfect
                  ? "border-2 border-orange-500 dark:border-orange-500/40 bg-transparent text-orange-400"
                  : "text-gray-500 bg-transparent"
              }`}
              onClick={() => { setCurrentDate(new Date(year, month, day))}}
            >
              {day}
              
            </Button>
          );
        })}
      </div>
    </div>
  );
};
"use client";

import { Button } from "@/components/ui/button";
import { useDateStore } from "@/store/use-date-store";

export const Header = () => {

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
          const isToday =
            day === realToday.getDate() &&
            month === realToday.getMonth() &&
            year === realToday.getFullYear();

          const isSelected =
            day === currentDate.getDate() &&
            month === currentDate.getMonth() &&
            year === currentDate.getFullYear();

          return (
            <Button
              key={day}
              className={`text-xs cursor-pointer px-3 h-7 w-7 rounded-full ${
                isSelected
                  ? "bg-zinc-800 dark:bg-white dark:text- border-0 font-bold "
                  : isToday
                  ? "border-2 border-black/50 dark:border-white/50 bg-transparent dark:text-white text-black"
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
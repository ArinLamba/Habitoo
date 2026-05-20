"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { formatDate } from "@/lib/date";
import { useDateStore } from "@/store/use-date-store";

const getMsUntilNextDay = () => {
  const now = new Date();
  const next = new Date(now);
  next.setDate(now.getDate() + 1);
  next.setHours(0, 0, 1, 0);

  return next.getTime() - now.getTime();
};

export const useTodayRollover = () => {
  const queryClient = useQueryClient();
  const setCurrentDate = useDateStore((state) => state.setCurrentDate);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const syncDay = () => {
      const today = new Date();
      setCurrentDate(today);
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });

      timeoutId = setTimeout(syncDay, getMsUntilNextDay());
    };

    timeoutId = setTimeout(syncDay, getMsUntilNextDay());

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const current = useDateStore.getState().currentDate;
        if (formatDate(current) !== formatDate(new Date())) {
          syncDay();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [queryClient, setCurrentDate]);
};

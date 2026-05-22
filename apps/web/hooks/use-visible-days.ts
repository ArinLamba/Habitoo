"use client";

import { useEffect, useState } from "react";

import { getLast14Days } from "@/lib/helper";
import { getVisibleDayCount } from "@/lib/habits/visible-days";

export const useVisibleDays = () => {
  const [count, setCount] = useState(() => getVisibleDayCount());

  useEffect(() => {
    const handleResize = () => {
      setCount(getVisibleDayCount());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return getLast14Days().slice(-count);
};

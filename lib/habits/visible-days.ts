import { getLast14Days } from "@/lib/helper";

export const getVisibleDays = () => {
  // Tailwind breakpoints using browser width
  if (typeof window === "undefined") {
    return getLast14Days();
  }

  const width = window.innerWidth;

  if (width < 640) {
    return getLast14Days().slice(-4);
  }

  if (width < 1024) {
    return getLast14Days().slice(-7);
  }

  return getLast14Days();
};
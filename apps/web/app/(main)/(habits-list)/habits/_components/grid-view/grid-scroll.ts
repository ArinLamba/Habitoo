
import type { UIEvent } from "react";

export const syncHabitGridScroll = (
  event: UIEvent<HTMLDivElement>
) => {
  const source = event.currentTarget;
  const scrollLeft = source.scrollLeft;

  const scrollContainers =
    document.querySelectorAll<HTMLDivElement>(
      "[data-habit-grid-scroll]"
    );

  scrollContainers.forEach((container) => {
    if (
      container !== source &&
      container.scrollLeft !== scrollLeft
    ) {
      container.scrollLeft = scrollLeft;
    }
  });
};

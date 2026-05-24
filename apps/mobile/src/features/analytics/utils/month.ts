import { formatDate } from "@habitoo/core";

export const getMonthLabel = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

export const getMonthDays = (month: Date) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const last = new Date(year, monthIndex + 1, 0).getDate();

  return Array.from({ length: last }, (_, index) => {
    return new Date(year, monthIndex, index + 1);
  });
};

export const getMonthDateKeys = (month: Date) =>
  getMonthDays(month).map((date) => formatDate(date));

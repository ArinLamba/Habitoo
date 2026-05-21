"use server";

import { getUserId } from "@/lib/get-user-id";

import { createHabitLog } from "@/server/services/habit-logs";

export const addHabitLog = async ({
  habitId,
  date,
  value,
  note,
}: {
  habitId: string;
  date: string;
  value: number;
  note?: string;
}) => {

  const userId = await getUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  if(value === 0) return;

  return createHabitLog({
    habitId,
    userId,
    date,
    value,
    note,
  });
};
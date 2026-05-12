"use server";
import { getUserId } from "@/lib/get-user-id";
import { HabitStatus } from "@/lib/types";
import { setHabitStatus } from "@/server/services/set-habit-status";

export const setHabit = async (
    id: string,
    date: string,
    status: HabitStatus | null,
  ) => {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  
  console.log("🔥 DB HIT: markHabit", new Date().toISOString());

  return setHabitStatus(userId, id, date, status);
};
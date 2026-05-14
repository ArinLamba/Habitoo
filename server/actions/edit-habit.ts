"use server";

import { getUserId } from "@/lib/get-user-id";
import { HabitFormValues } from "@/lib/types";
import { updateHabit } from "@/server/services/habits";

export const editHabit = async (id: string, data: HabitFormValues) => {
  const userId = await getUserId();

  if(!userId) throw new Error("Unauthorized");

  console.log("🔥 DB HIT: editHabit", new Date().toISOString());

  return updateHabit(userId, id, data);
};
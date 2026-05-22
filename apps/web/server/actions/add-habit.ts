"use server";

import { createHabit } from "@/server/services/habits";
import { getUserId } from "@/lib/get-user-id";
import { HabitFormValues } from "@/lib/types";


export const upsertNewHabit = async (data: HabitFormValues) => {
  const userId = await getUserId();

  if(!userId) throw new Error("Unauthorized");

  console.log("🔥 DB HIT: addHabit", new Date().toISOString());

  return createHabit(userId, data);
};
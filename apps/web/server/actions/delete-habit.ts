"use server";

import { getUserId } from "@/lib/get-user-id";

import { removeHabit } from "@/server/services/habits";

export const deleteHabit = async (id: string) => {
  const userId = await getUserId();

  if(!userId) throw new Error("Unauthorized");
  console.log("🔥 DB HIT: deleteHabit", new Date().toISOString());

  return removeHabit(userId, id);
};  
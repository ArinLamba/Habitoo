"use server";

import { getUserId } from "@/lib/get-user-id";
import { Habit } from "@/lib/types";
import { updateHabitLifecycle } from "@/server/services/habits";

export const setHabitLifecycle = async (
  id: string,
  lifecycle: Habit["lifecycle"]
) => {
  const userId = await getUserId();

  if (!userId) throw new Error("Unauthorized");

  return updateHabitLifecycle(userId, id, lifecycle);
};

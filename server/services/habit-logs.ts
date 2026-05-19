"use server";

import db from "@/db";

import { habitCompletions } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const createHabitLog = async ({
  habitId,
  userId,
  date,
  value,
  note,
}: {
  habitId: string;
  userId: string;
  date: string;
  value: number;
  note?: string;
}) => {
  const habit = await db.query.habits.findFirst({
    where: (h, { and, eq }) =>
      and(
        eq(h.id, habitId),
        eq(h.userId, userId)
      ),
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  const [log] = await db
    .insert(habitCompletions)
    .values({
      habitId,
      userId,
      date,
      value: value.toString(),
      note,
    })
    .returning();
  
  revalidatePath(`/habits/${habitId}`);

  return log;
};

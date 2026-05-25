"use server";

import db from "@/db";

import { habitCompletions } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { and, eq, inArray, isNotNull, isNull } from "drizzle-orm";

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

  await db
    .delete(habitCompletions)
    .where(
      and(
        eq(habitCompletions.habitId, habitId),
        eq(habitCompletions.userId, userId),
        eq(habitCompletions.date, date),
        isNull(habitCompletions.value)
      )
    );

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

export const deleteHabitLogs = async ({
  habitId,
  userId,
  logIds,
}: {
  habitId: string;
  userId: string;
  logIds: string[];
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

  if (logIds.length === 0) {
    return [];
  }

  const deletedLogs = await db
    .delete(habitCompletions)
    .where(
      and(
        eq(habitCompletions.habitId, habitId),
        eq(habitCompletions.userId, userId),
        inArray(habitCompletions.id, logIds),
        isNotNull(habitCompletions.value)
      )
    )
    .returning({ id: habitCompletions.id });

  revalidatePath(`/habits/${habitId}`);

  return deletedLogs;
};

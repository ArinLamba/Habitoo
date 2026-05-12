import db from "@/db";

import { habits } from "@/db/schema";

import { HabitFormValues } from "@/lib/types";

import { and, eq } from "drizzle-orm";

export const createHabit = async (
  userId: string,
  data: HabitFormValues
) => {

  const [habit] = await db
    .insert(habits)
    .values({
      userId,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      targetValue: String(data.targetValue),
      unit: data.unit,
      frequency: data.frequency,
      icon: data.icon,
      color: data.color,    
      
    })
    .returning();

  return habit;
};

export const updateHabit = async (
  userId: string,
  id: string,
  name: string
) => {
  await db
    .update(habits)
    .set({ name })
    .where(
      and(
        eq(habits.id, id),
        eq(habits.userId, userId)
      )
    );
};

export const removeHabit = async (
  userId: string,
  id: string
) => {
  await db
    .delete(habits)
    .where(
      and(
        eq(habits.id, id),
        eq(habits.userId, userId)
      )
    );
};
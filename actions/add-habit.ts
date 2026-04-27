"use server";

import db from "@/db";
import { habits } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";


export const upsertNewHabit = async (name: string) => {
  const { userId } = await auth();

  if(!userId) throw new Error("Unauthorized");

  console.log("🔥 DB HIT: addHabit", new Date().toISOString());

  const [newHabit] = await db
    .insert(habits)
    .values({ userId, name })
    .returning();

  return newHabit;
};
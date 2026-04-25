"use server";

import db from "@/db";
import { habits } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const editHabit = async (id: string, name: string) => {
  const { userId } = await auth();

  if(!userId) throw new Error("Unauthorized");

  console.log("🔥 DB HIT: editHabit", new Date().toISOString());

  await db
    .update(habits)
    .set({ name })
    .where(eq(habits.id, id))
};
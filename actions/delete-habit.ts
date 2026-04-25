"use server";

import db from "@/db";
import { habits } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const deleteHabit = async (id: string) => {
  const { userId } = await auth();

  if(!userId) throw new Error("Unauthorized");
  console.log("🔥 DB HIT: deleteHabit", new Date().toISOString());

  await db
    .delete(habits)
    .where(eq(habits.id, id))
};
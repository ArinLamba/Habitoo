"use server";

import db from "@/db";
import { dailyNotes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const upsertNote = async (
  date: string,
  note: string,
  highlight: string
) => {
  const { userId } = await auth();
  if (!userId) return;
  console.log("🔥 DB HIT: addNote", new Date().toISOString());

  const existing = await db.query.dailyNotes.findFirst({
    where: (dn, { and, eq }) =>
      and(eq(dn.userId, userId), eq(dn.date, date)),
  });

  if (existing) {
    await db
      .update(dailyNotes)
      .set({ note, highlight })
      .where(eq(dailyNotes.id, existing.id));
  } else {
    await db.insert(dailyNotes).values({
      userId,
      date,
      note,
      highlight,
    });
  }
};
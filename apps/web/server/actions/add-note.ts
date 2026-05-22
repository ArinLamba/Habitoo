"use server";

import { getUserId } from "@/lib/get-user-id";

import { saveNote } from "@/server/services/notes";

export const upsertNote = async (
  date: string,
  note: string,
  highlight: string
) => {
  const userId = await getUserId();
  if (!userId) return;
  console.log("🔥 DB HIT: addNote", new Date().toISOString());

  return saveNote(userId, date, note, highlight);
};
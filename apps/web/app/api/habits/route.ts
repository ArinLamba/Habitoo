import { habitFormSchema } from "@habitoo/core";
import { NextResponse } from "next/server";

import { getHabits } from "@/db/queries";
import { getUserId } from "@/lib/get-user-id";
import { createHabit } from "@/server/services/habits";

import { badRequest, serverError, unauthorized } from "../_lib/responses";

export const GET = async () => {
  try {
    const habits = await getHabits();
    return NextResponse.json({ habits });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorized();
    }

    return serverError();
  }
};

export const POST = async (req: Request) => {
  const userId = await getUserId();

  if (!userId) {
    return unauthorized();
  }

  const parsed = habitFormSchema.safeParse(await req.json());

  if (!parsed.success) {
    return badRequest("Invalid habit payload");
  }

  const habit = await createHabit(userId, parsed.data);
  return NextResponse.json({ habit }, { status: 201 });
};

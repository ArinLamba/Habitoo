import { createHabit } from "@/server/services/habits";
import { getUserId } from "@/lib/get-user-id";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

  const userId = await getUserId();
  if(!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await req.json();
  
  const habit = await createHabit(userId, body.name);
  return NextResponse.json(habit);
}
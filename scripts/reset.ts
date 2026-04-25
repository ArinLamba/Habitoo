import "dotenv/config";
import db from "@/db/index";
import * as schema from "../db/schema";

async function reset() {
  // const userId = "user_3CWyo4DZn76S2V0EFVRi3wTAqT7"; // 👈 replace with your Clerk userId later
  // const userId = "user_asldkfj"; // 👈 replace with your Clerk userId later
  
  await db.delete(schema.habitCompletions);
  await db.delete(schema.habits);
  console.log("Reset Complete");
}

reset();
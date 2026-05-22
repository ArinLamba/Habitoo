import "dotenv/config";
import db from "@/db/index";
import * as schema from "../db/schema";

async function reset() {
  
  await db.delete(schema.habitCompletions);
  await db.delete(schema.habits);
  console.log("Reset Complete");
}

reset();
// import "dotenv/config";
// import db from "@/db/index";
// import * as schema from "@/db/schema";

// const daysAgo = (n: number) => {
//   const d = new Date();
//   d.setDate(d.getDate() - n);
//   return d;
// };

// async function main() {

  
//   await db.delete(schema.habitCompletions);
//   await db.delete(schema.habits);

//   // 1. Create habits
//   const createdHabits = await db.insert(schema.habits).values([
//     { userId, name: "Read", createdAt: daysAgo(3) },
//     { userId, name: "Gym", createdAt: daysAgo(2) },
//     { userId, name: "Code" },
//   ]).returning();

//   const today = new Date().toISOString().split("T")[0];

//   // 2. Add completions (simulate some done, some not)
//   await db.insert(schema.habitCompletions).values([
//     {
//       habitId: createdHabits[0].id,
//       date: today,
//       completed: true,
//     },
//     {
//       habitId: createdHabits[1].id,
//       date: today,
//       completed: false,
//     },
//     {
//       habitId: createdHabits[2].id,
//       date: today,
//       completed: true,
//     },
//   ]);

//   console.log("✅ Seed data inserted");
// }

// main();
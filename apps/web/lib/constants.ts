// import { HabitIconName } from "./habit-icons";

// /**
//  * Type-safe helper to get all valid Lucide icon names.
//  * This prevents the "Icons as any" error by providing a strict list of keys.
//  */


// export interface HabitIcon {
//   name: HabitIconName;
//   icon: React.ElementType;
// }

// /**
//  * Standard colors for habit branding.
//  */
// export const HABIT_COLORS = [
//   { name: "Blue", value: "#3b82f6" },
//   { name: "Rose", value: "#f43f5e" },
//   { name: "Green", value: "#10b981" },
//   { name: "Amber", value: "#f59e0b" },
//   { name: "Violet", value: "#8b5cf6" },

//   // NEW ADDITIONS
//   { name: "Cyan", value: "#06b6d4" },
//   { name: "Indigo", value: "#6366f1" },
//   { name: "Lime", value: "#84cc16" },
//   { name: "Orange", value: "#f97316" },
//   { name: "Pink", value: "#ec4899" },
//   { name: "Emerald", value: "#22c55e" },
//   { name: "Sky", value: "#0ea5e9" },
// ] as const;

// export type HabitColorValue = (typeof HABIT_COLORS)[number]["value"];

// /**
//  * Comprehensive list of suggested habits with associated icons.
//  * The 'icon' string here must match a 'name' in HABIT_ICONS.
//  */
// export const SUGGESTED_HABITS = [
//   {
//     label: "🔥 Most Popular",
//     habits: [
//       { name: "Drink Water", icon: "Droplets" as HabitIconName },
//       { name: "Morning Run", icon: "Running" as HabitIconName }, // FIXED
//       { name: "Meditation", icon: "Brain" as HabitIconName },
//       { name: "Read", icon: "BookOpen" as HabitIconName },
//       { name: "Sleep Early", icon: "Moon" as HabitIconName },
//     ],
//   },

//   {
//     label: "💪 Health & Fitness",
//     habits: [
//       { name: "Gym Session", icon: "Dumbbell" as HabitIconName },
//       { name: "Yoga", icon: "Sun" as HabitIconName }, // FIXED (calm flow > activity)
//       { name: "Walk 10k Steps", icon: "Footprints" as HabitIconName }, // FIXED IDEA (better than Activity)
//       { name: "No Sugar", icon: "Utensils" as HabitIconName },
//       { name: "Stretching", icon: "Wind" as HabitIconName }, // better than Sun/Activity
//       { name: "Cold Shower", icon: "Droplets" as HabitIconName },
//       { name: "Protein Intake", icon: "Dumbbell" as HabitIconName },
//     ],
//   },

//   {
//     label: "🧠 Mindset & Growth",
//     habits: [
//       { name: "Journaling", icon: "PenTool" as HabitIconName }, // FIXED
//       { name: "Gratitude", icon: "Heart" as HabitIconName },
//       { name: "Deep Work", icon: "Target" as HabitIconName }, // FIXED (better than Briefcase)
//       { name: "Learn a Language", icon: "Globe" as HabitIconName }, // FIXED IDEA
//       { name: "Daily Reflection", icon: "Brain" as HabitIconName },
//       { name: "Affirmations", icon: "Sparkles" as HabitIconName }, // FIXED IDEA
//       { name: "Read 20 Pages", icon: "BookOpen" as HabitIconName },
//     ],
//   },

//   {
//     label: "💰 Finance & Productivity",
//     habits: [
//       { name: "Save Money", icon: "Coins" as HabitIconName },
//       { name: "Track Expenses", icon: "Receipt" as HabitIconName }, // FIXED IDEA
//       { name: "Inbox Zero", icon: "Mail" as HabitIconName }, // FIXED IDEA
//       { name: "Plan Tomorrow", icon: "Calendar" as HabitIconName }, // FIXED IDEA
//       { name: "Focus Time", icon: "Timer" as HabitIconName },
//       { name: "No Distractions", icon: "Flame" as HabitIconName }, // FIXED (strong intent)
//     ],
//   },

//   {
//     label: "⚡ Lifestyle",
//     habits: [
//       { name: "Wake Up Early", icon: "Sunrise" as HabitIconName }, // FIXED
//       { name: "Limit Screen Time", icon: "Smartphone" as HabitIconName }, // FIXED IDEA
//       { name: "Drink Coffee Mindfully", icon: "Coffee" as HabitIconName },
//       { name: "Declutter Room", icon: "Trash2" as HabitIconName }, // FIXED IDEA
//       { name: "Walk Outside", icon: "Trees" as HabitIconName }, // FIXED IDEA
//     ],
//   },
// ] as const;

// export const UNIT_GROUPS = [
//   { label: "Scalar", units: ["times", "steps", "reps"] },
//   { label: "Mass", units: ["kilograms", "grams", "pounds", "milligrams"] },
//   { label: "Volume", units: ["liters", "milliliters", "cups", "gallons"] },
//   { label: "Duration", units: ["seconds", "minutes", "hours", "days"] },
//   { label: "Energy", units: ["calories", "kilocalories", "kilojoules"] },
//   { label: "Length", units: ["kilometers", "meters", "miles", "feet", "inches"] },
//   // NEW GROUPS
//   { label: "Hydration", units: ["glasses", "bottles"] },
//   { label: "Finance", units: ["rupees", "dollars", "savings entries"] },
//   { label: "Focus", units: ["pomodoros", "sessions"] },
// ];
import * as Icons from "lucide-react";
import { LucideIconName } from "./types";

/**
 * Type-safe helper to get all valid Lucide icon names.
 * This prevents the "Icons as any" error by providing a strict list of keys.
 */


export interface HabitIcon {
  name: LucideIconName;
  icon: React.ElementType;
}

/**
 * Curated list of icons for the Icon Picker.
 * Using 'as const' helps TS infer the literal string values.
 */
export const HABIT_ICONS: HabitIcon[] = [
  { name: "Plus", icon: Icons.Plus }, // keep ONLY for generic "movement"

  { name: "Activity", icon: Icons.Activity }, // cardio-specific reuse is okay
  { name: "Zap", icon: Icons.Zap }, // energy / morning boost
  { name: "Sunrise", icon: Icons.Sun }, // morning habits

  { name: "Droplets", icon: Icons.Droplets },
  { name: "BookOpen", icon: Icons.BookOpen },
  { name: "Brain", icon: Icons.Brain },
  { name: "Dumbbell", icon: Icons.Dumbbell },
  { name: "Moon", icon: Icons.Moon },
  { name: "Coins", icon: Icons.Coins },
  { name: "Briefcase", icon: Icons.Briefcase },
  { name: "Utensils", icon: Icons.Utensils },
  { name: "Users", icon: Icons.Users },

  // NEW MEANINGFUL SPLIT (IMPORTANT FIX)
  { name: "Focus", icon: Icons.Target }, // deep work / productivity
  { name: "Flame", icon: Icons.Flame }, // discipline / streak energy
  { name: "Heart", icon: Icons.Heart }, // mental health / gratitude
  { name: "Coffee", icon: Icons.Coffee }, // routines / morning ritual
  { name: "Timer", icon: Icons.Timer }, // focus sessions / pomodoro
  { name: "Pen", icon: Icons.PenTool }, // journaling / writing
];
/**
 * Standard colors for habit branding.
 */
export const HABIT_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Green", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Violet", value: "#8b5cf6" },

  // NEW ADDITIONS
  { name: "Cyan", value: "#06b6d4" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Lime", value: "#84cc16" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Emerald", value: "#22c55e" },
  { name: "Sky", value: "#0ea5e9" },
] as const;

export type HabitColorValue = (typeof HABIT_COLORS)[number]["value"];

/**
 * Comprehensive list of suggested habits with associated icons.
 * The 'icon' string here must match a 'name' in HABIT_ICONS.
 */
export const SUGGESTED_HABITS = [
  {
    label: "🔥 Most Popular",
    habits: [
      { name: "Drink Water", icon: "Droplets" as LucideIconName },
      { name: "Morning Run", icon: "Running" as LucideIconName }, // FIXED
      { name: "Meditation", icon: "Brain" as LucideIconName },
      { name: "Read", icon: "BookOpen" as LucideIconName },
      { name: "Sleep Early", icon: "Moon" as LucideIconName },
    ],
  },

  {
    label: "💪 Health & Fitness",
    habits: [
      { name: "Gym Session", icon: "Dumbbell" as LucideIconName },
      { name: "Yoga", icon: "Sun" as LucideIconName }, // FIXED (calm flow > activity)
      { name: "Walk 10k Steps", icon: "Footprints" as LucideIconName }, // FIXED IDEA (better than Activity)
      { name: "No Sugar", icon: "Utensils" as LucideIconName },
      { name: "Stretching", icon: "Wind" as LucideIconName }, // better than Sun/Activity
      { name: "Cold Shower", icon: "Droplets" as LucideIconName },
      { name: "Protein Intake", icon: "Dumbbell" as LucideIconName },
    ],
  },

  {
    label: "🧠 Mindset & Growth",
    habits: [
      { name: "Journaling", icon: "PenTool" as LucideIconName }, // FIXED
      { name: "Gratitude", icon: "Heart" as LucideIconName },
      { name: "Deep Work", icon: "Target" as LucideIconName }, // FIXED (better than Briefcase)
      { name: "Learn a Language", icon: "Globe" as LucideIconName }, // FIXED IDEA
      { name: "Daily Reflection", icon: "Brain" as LucideIconName },
      { name: "Affirmations", icon: "Sparkles" as LucideIconName }, // FIXED IDEA
      { name: "Read 20 Pages", icon: "BookOpen" as LucideIconName },
    ],
  },

  {
    label: "💰 Finance & Productivity",
    habits: [
      { name: "Save Money", icon: "Coins" as LucideIconName },
      { name: "Track Expenses", icon: "Receipt" as LucideIconName }, // FIXED IDEA
      { name: "Inbox Zero", icon: "Mail" as LucideIconName }, // FIXED IDEA
      { name: "Plan Tomorrow", icon: "Calendar" as LucideIconName }, // FIXED IDEA
      { name: "Focus Time", icon: "Timer" as LucideIconName },
      { name: "No Distractions", icon: "Flame" as LucideIconName }, // FIXED (strong intent)
    ],
  },

  {
    label: "⚡ Lifestyle",
    habits: [
      { name: "Wake Up Early", icon: "Sunrise" as LucideIconName }, // FIXED
      { name: "Limit Screen Time", icon: "Smartphone" as LucideIconName }, // FIXED IDEA
      { name: "Drink Coffee Mindfully", icon: "Coffee" as LucideIconName },
      { name: "Declutter Room", icon: "Trash2" as LucideIconName }, // FIXED IDEA
      { name: "Walk Outside", icon: "Trees" as LucideIconName }, // FIXED IDEA
    ],
  },
] as const;

export const UNIT_GROUPS = [
  { label: "Scalar", units: ["times", "steps", "reps"] },
  { label: "Mass", units: ["kilograms", "grams", "pounds", "milligrams"] },
  { label: "Volume", units: ["liters", "milliliters", "cups", "gallons"] },
  { label: "Duration", units: ["seconds", "minutes", "hours", "days"] },
  { label: "Energy", units: ["calories", "kilocalories", "kilojoules"] },
  { label: "Length", units: ["kilometers", "meters", "miles", "feet", "inches"] },
  // NEW GROUPS
  { label: "Hydration", units: ["glasses", "bottles"] },
  { label: "Finance", units: ["rupees", "dollars", "savings entries"] },
  { label: "Focus", units: ["pomodoros", "sessions"] },
];
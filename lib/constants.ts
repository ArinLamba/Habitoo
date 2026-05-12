import * as Icons from "lucide-react";

/**
 * Type-safe helper to get all valid Lucide icon names.
 * This prevents the "Icons as any" error by providing a strict list of keys.
 */
export type LucideIconName = keyof typeof Icons;

export interface HabitIcon {
  name: LucideIconName;
  icon: React.ElementType;
}

/**
 * Curated list of icons for the Icon Picker.
 * Using 'as const' helps TS infer the literal string values.
 */
export const HABIT_ICONS: HabitIcon[] = [
  { name: "Activity", icon: Icons.Activity },
  { name: "Droplets", icon: Icons.Droplets },
  { name: "BookOpen", icon: Icons.BookOpen },
  { name: "Brain", icon: Icons.Brain },
  { name: "Dumbbell", icon: Icons.Dumbbell },
  { name: "Moon", icon: Icons.Moon },
  { name: "Coins", icon: Icons.Coins },
  { name: "Briefcase", icon: Icons.Briefcase },
  { name: "Utensils", icon: Icons.Utensils },
  { name: "Users", icon: Icons.Users },
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
] as const;

export type HabitColorValue = (typeof HABIT_COLORS)[number]["value"];

/**
 * Comprehensive list of suggested habits with associated icons.
 * The 'icon' string here must match a 'name' in HABIT_ICONS.
 */
export const SUGGESTED_HABITS = [
  {
    label: "Most Popular",
    habits: [
      { name: "Drink Water", icon: "Droplets" as LucideIconName },
      { name: "Morning Run", icon: "Activity" as LucideIconName },
      { name: "Meditation", icon: "Brain" as LucideIconName },
      { name: "Read", icon: "BookOpen" as LucideIconName },
    ],
  },
  {
    label: "Health & Fitness",
    habits: [
      { name: "Gym Session", icon: "Dumbbell" as LucideIconName },
      { name: "Yoga", icon: "Activity" as LucideIconName },
      { name: "Walk 10k Steps", icon: "Activity" as LucideIconName },
      { name: "No Sugar", icon: "Utensils" as LucideIconName },
      { name: "Sleep 8 Hours", icon: "Moon" as LucideIconName },
    ],
  },
  {
    label: "Mindset & Growth",
    habits: [
      { name: "Journaling", icon: "BookOpen" as LucideIconName },
      { name: "Gratitude", icon: "Brain" as LucideIconName },
      { name: "Deep Work", icon: "Briefcase" as LucideIconName },
      { name: "Learn a Language", icon: "Users" as LucideIconName },
      { name: "Daily Reflection", icon: "Moon" as LucideIconName },
    ],
  },
  {
    label: "Finance & Productivity",
    habits: [
      { name: "Save Money", icon: "Coins" as LucideIconName },
      { name: "Inbox Zero", icon: "Briefcase" as LucideIconName },
      { name: "Track Expenses", icon: "Coins" as LucideIconName },
      { name: "Plan Tomorrow", icon: "BookOpen" as LucideIconName },
      { name: "Focus Time", icon: "Activity" as LucideIconName },
    ],
  },
] as const;

export const UNIT_GROUPS = [
  { label: "Scalar", units: ["times", "steps", "reps"] },
  { label: "Mass", units: ["kilograms", "grams", "pounds"] },
  { label: "Volume", units: ["liters", "mililiter", "cups"] },
  { label: "Duration", units: ["seconds", "minutes", "hours"] },
  { label: "Energy", units: ["kilo calories", "kilojoules", "calories"] },
  { label: "Length", units: ["kilometer", "meter", "miles", "feets"] },
]
import type { HabitFrequency } from "./habits";
import type { HabitColorValue, HabitIconName } from "./habit-icons";

export type SuggestedHabit = {
  name: string;
  icon: HabitIconName;
  color?: HabitColorValue;
  targetValue?: number;
  unit?: string;
  frequency?: HabitFrequency;
};

export type SuggestedHabitGroup = {
  label: string;
  habits: SuggestedHabit[];
};

export const SUGGESTED_HABITS: SuggestedHabitGroup[] = [
  {
    label: "Most Popular",
    habits: [
      { name: "Drink Water", icon: "Water", color: "#06b6d4", targetValue: 8, unit: "glasses" },
      { name: "Morning Run", icon: "Run", color: "#f97316", targetValue: 3, unit: "kilometers" },
      { name: "Meditation", icon: "Brain", color: "#8b5cf6", targetValue: 10, unit: "minutes" },
      { name: "Read", icon: "Book", color: "#3b82f6", targetValue: 20, unit: "pages" },
      { name: "Sleep Early", icon: "Moon", color: "#6366f1", targetValue: 1, unit: "times" },
      { name: "Plan Tomorrow", icon: "Calendar", color: "#10b981", targetValue: 1, unit: "times" },
      { name: "Wake Up On Time", icon: "Alarm", color: "#f59e0b", targetValue: 1, unit: "times" },
      { name: "Finish Top Task", icon: "ClipboardCheck", color: "#34d399", targetValue: 1, unit: "tasks" },
    ],
  },
  {
    label: "Health and Fitness",
    habits: [
      { name: "Gym Session", icon: "Gym", color: "#f43f5e", targetValue: 1, unit: "sessions" },
      { name: "Yoga", icon: "Yoga", color: "#14b8a6", targetValue: 20, unit: "minutes" },
      { name: "Walk 10k Steps", icon: "Walk", color: "#22c55e", targetValue: 10000, unit: "steps" },
      { name: "No Sugar", icon: "Food", color: "#f59e0b", targetValue: 1, unit: "days" },
      { name: "Stretching", icon: "Stretching", color: "#0ea5e9", targetValue: 10, unit: "minutes" },
      { name: "Cold Shower", icon: "Water", color: "#06b6d4", targetValue: 1, unit: "times" },
      { name: "Protein Intake", icon: "Apple", color: "#84cc16", targetValue: 100, unit: "grams" },
      { name: "Brush Teeth", icon: "Brush", color: "#3b82f6", targetValue: 2, unit: "times" },
      { name: "Take Vitamins", icon: "Pill", color: "#d946ef", targetValue: 1, unit: "times" },
      { name: "Mood Check", icon: "MoodSmile", color: "#f59e0b", targetValue: 1, unit: "times" },
      { name: "Swim", icon: "Swimming", color: "#0ea5e9", targetValue: 30, unit: "minutes" },
      { name: "Weigh In", icon: "Scale", color: "#64748b", targetValue: 1, unit: "times" },
      { name: "Medicine", icon: "MedicineSyrup", color: "#ec4899", targetValue: 1, unit: "medications" },
      { name: "Eye Rest", icon: "Eye", color: "#14b8a6", targetValue: 5, unit: "minutes" },
      { name: "Breathing", icon: "Wind", color: "#06b6d4", targetValue: 10, unit: "breaths" },
    ],
  },
  {
    label: "Mindset and Growth",
    habits: [
      { name: "Journaling", icon: "Journal", color: "#8b5cf6", targetValue: 1, unit: "entries" },
      { name: "Gratitude", icon: "Heart", color: "#f43f5e", targetValue: 3, unit: "times" },
      { name: "Deep Work", icon: "Focus", color: "#6366f1", targetValue: 2, unit: "hours" },
      { name: "Learn a Language", icon: "Language", color: "#0ea5e9", targetValue: 15, unit: "minutes" },
      { name: "Daily Reflection", icon: "Brain", color: "#8b5cf6", targetValue: 1, unit: "times" },
      { name: "Affirmations", icon: "Sparkles", color: "#ec4899", targetValue: 5, unit: "times" },
      { name: "Read 20 Pages", icon: "Book", color: "#3b82f6", targetValue: 20, unit: "pages" },
      { name: "Study Session", icon: "Study", color: "#10b981", targetValue: 1, unit: "sessions" },
      { name: "Write", icon: "Writing", color: "#8b5cf6", targetValue: 250, unit: "words" },
      { name: "Watch Lesson", icon: "Youtube", color: "#dc2626", targetValue: 1, unit: "lessons" },
      { name: "Read News", icon: "News", color: "#64748b", targetValue: 1, unit: "articles" },
      { name: "Quiet Time", icon: "Hourglass", color: "#6366f1", targetValue: 15, unit: "minutes" },
    ],
  },
  {
    label: "Finance and Productivity",
    habits: [
      { name: "Save Money", icon: "Savings", color: "#22c55e", targetValue: 1, unit: "savings entries" },
      { name: "Track Expenses", icon: "Receipt", color: "#f59e0b", targetValue: 1, unit: "times" },
      { name: "Inbox Zero", icon: "Mail", color: "#06b6d4", targetValue: 1, unit: "times" },
      { name: "Focus Time", icon: "Timer", color: "#6366f1", targetValue: 4, unit: "pomodoros" },
      { name: "No Distractions", icon: "Flame", color: "#f97316", targetValue: 1, unit: "blocks" },
      { name: "Budget Review", icon: "Wallet", color: "#10b981", targetValue: 1, unit: "times", frequency: "week" },
      { name: "Code Practice", icon: "Coding", color: "#64748b", targetValue: 30, unit: "minutes" },
      { name: "Review Goals", icon: "ChartLine", color: "#0ea5e9", targetValue: 1, unit: "times", frequency: "week" },
      { name: "Learning Sprint", icon: "Timer", color: "#6366f1", targetValue: 2, unit: "pomodoros" },
      { name: "Log Transaction", icon: "Receipt", color: "#f59e0b", targetValue: 1, unit: "transactions" },
    ],
  },
  {
    label: "Lifestyle",
    habits: [
      { name: "Wake Up Early", icon: "Sunrise", color: "#f59e0b", targetValue: 1, unit: "times" },
      { name: "Limit Screen Time", icon: "Phone", color: "#64748b", targetValue: 2, unit: "hours" },
      { name: "Drink Coffee Mindfully", icon: "Coffee", color: "#f97316", targetValue: 1, unit: "times" },
      { name: "Declutter Room", icon: "Trash", color: "#14b8a6", targetValue: 10, unit: "minutes" },
      { name: "Walk Outside", icon: "Nature", color: "#22c55e", targetValue: 15, unit: "minutes" },
      { name: "Cook at Home", icon: "ChefHat", color: "#f43f5e", targetValue: 1, unit: "times" },
      { name: "Clean Desk", icon: "Home", color: "#06b6d4", targetValue: 1, unit: "times" },
      { name: "Laundry", icon: "Wash", color: "#3b82f6", targetValue: 1, unit: "times" },
      { name: "Tidy Closet", icon: "Shirt", color: "#8b5cf6", targetValue: 10, unit: "minutes" },
      { name: "Soup or Meal Prep", icon: "Soup", color: "#f97316", targetValue: 1, unit: "meals" },
      { name: "Water Plants", icon: "Plant2", color: "#22c55e", targetValue: 1, unit: "times" },
      { name: "Errand Run", icon: "MapPin", color: "#14b8a6", targetValue: 1, unit: "items" },
      { name: "Fix Something", icon: "Tools", color: "#64748b", targetValue: 1, unit: "tasks" },
    ],
  },
  {
    label: "Creative and Social",
    habits: [
      { name: "Sketch", icon: "Palette", color: "#d946ef", targetValue: 15, unit: "minutes" },
      { name: "Take a Photo", icon: "Camera", color: "#0ea5e9", targetValue: 1, unit: "times" },
      { name: "Practice Music", icon: "Music", color: "#8b5cf6", targetValue: 20, unit: "minutes" },
      { name: "Voice Notes", icon: "Microphone", color: "#f43f5e", targetValue: 1, unit: "times" },
      { name: "Call Someone", icon: "Call", color: "#10b981", targetValue: 1, unit: "times", frequency: "week" },
      { name: "Paint", icon: "Paint", color: "#d946ef", targetValue: 20, unit: "minutes" },
      { name: "Guitar Practice", icon: "Guitar", color: "#f59e0b", targetValue: 15, unit: "minutes" },
      { name: "Meet a Friend", icon: "Friends", color: "#06b6d4", targetValue: 1, unit: "times", frequency: "week" },
      { name: "Celebrate Win", icon: "Confetti", color: "#ec4899", targetValue: 1, unit: "times" },
    ],
  },
] as const satisfies SuggestedHabitGroup[];

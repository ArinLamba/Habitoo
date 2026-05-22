
import {
  IconQuestionMark,
  IconPlus,

  // Fitness
  IconRun,
  IconWalk,
  IconYoga,
  IconBarbell,
  IconBike,
  IconHeartbeat,
  IconFlame,
  IconBolt,

  // Mind
  IconBrain,
  IconBook,
  IconNotebook,
  IconSchool,
  IconTargetArrow,
  IconClockHour4,
  IconSparkles,

  // Health
  IconMoon,
  IconDroplet,
  IconHeart,
  IconApple,
  IconToolsKitchen2,

  // Productivity
  IconBriefcase,
  IconCalendarEvent,
  IconChecklist,
  IconMail,
  IconReceipt,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconCode,

  // Finance
  IconCurrencyDollar,
  IconPigMoney,
  IconWallet,
  IconChartBar,

  // Lifestyle
  IconCoffee,
  IconSunrise,
  IconBath,
  IconTrash,
  IconTrees,
  IconMusic,
  IconPlane,

  // Social
  IconUsers,
  IconMessage,
  IconPhone,

  // Nature
  IconWind,
  IconCloud,
  IconLeaf,
  IconFlower,

  // Misc
  IconStar,
  IconTrophy,
  IconMedal,
} from "@tabler/icons-react";

export const ICON_MAP = {
  QuestionMark: IconQuestionMark,
  Plus: IconPlus,

  Run: IconRun,
  Walk: IconWalk,
  Yoga: IconYoga,
  Gym: IconBarbell,
  Cycling: IconBike,
  Heartbeat: IconHeartbeat,
  Flame: IconFlame,
  Energy: IconBolt,

  Brain: IconBrain,
  Book: IconBook,
  Journal: IconNotebook,
  Study: IconSchool,
  Focus: IconTargetArrow,
  Timer: IconClockHour4,
  Sparkles: IconSparkles,

  Moon: IconMoon,
  Water: IconDroplet,
  Heart: IconHeart,
  Apple: IconApple,
  Food: IconToolsKitchen2,

  Work: IconBriefcase,
  Calendar: IconCalendarEvent,
  Checklist: IconChecklist,
  Mail: IconMail,
  Receipt: IconReceipt,
  Laptop: IconDeviceLaptop,
  Phone: IconDeviceMobile,
  Coding: IconCode,

  Money: IconCurrencyDollar,
  Savings: IconPigMoney,
  Wallet: IconWallet,
  Analytics: IconChartBar,

  Coffee: IconCoffee,
  Sunrise: IconSunrise,
  Bath: IconBath,
  Trash: IconTrash,
  Nature: IconTrees,
  Music: IconMusic,
  Travel: IconPlane,

  Social: IconUsers,
  Chat: IconMessage,
  Call: IconPhone,

  Wind: IconWind,
  Cloud: IconCloud,
  Leaf: IconLeaf,
  Flower: IconFlower,

  Star: IconStar,
  Trophy: IconTrophy,
  Medal: IconMedal,
} as const;

export type HabitIconName = keyof typeof ICON_MAP;

export interface HabitIcon {
  name: HabitIconName;
  icon: React.ElementType;
}

export interface HabitIconCategory {
  label: string;
  icons: HabitIcon[];
}

const makeIcons = (names: HabitIconName[]): HabitIcon[] =>
  names.map((name) => ({
    name,
    icon: ICON_MAP[name],
  }));

export const ICON_CATEGORIES: HabitIconCategory[] = [
  {
    label: "🏃 Fitness",
    icons: makeIcons([
      "Run",
      "Walk",
      "Yoga",
      "Gym",
      "Cycling",
      "Heartbeat",
      "Flame",
      "Energy",
    ]),
  },

  {
    label: "🧠 Mind & Learning",
    icons: makeIcons([
      "Brain",
      "Book",
      "Journal",
      "Study",
      "Focus",
      "Timer",
      "Sparkles",
    ]),
  },

  {
    label: "❤️ Health",
    icons: makeIcons([
      "Moon",
      "Water",
      "Heart",
      "Apple",
      "Food",
    ]),
  },

  {
    label: "💼 Productivity",
    icons: makeIcons([
      "Work",
      "Calendar",
      "Checklist",
      "Mail",
      "Receipt",
      "Laptop",
      "Phone",
      "Coding",
    ]),
  },

  {
    label: "💰 Finance",
    icons: makeIcons([
      "Money",
      "Savings",
      "Wallet",
      "Analytics",
    ]),
  },

  {
    label: "🌿 Lifestyle",
    icons: makeIcons([
      "Coffee",
      "Sunrise",
      "Bath",
      "Trash",
      "Nature",
      "Music",
      "Travel",
    ]),
  },

  {
    label: "💬 Social",
    icons: makeIcons([
      "Social",
      "Chat",
      "Call",
    ]),
  },

  {
    label: "🍃 Nature",
    icons: makeIcons([
      "Wind",
      "Cloud",
      "Leaf",
      "Flower",
    ]),
  },

  {
    label: "🏆 Achievements",
    icons: makeIcons([
      "Star",
      "Trophy",
      "Medal",
    ]),
  },
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


export const SUGGESTED_HABITS = [
  {
    label: "🔥 Most Popular",
    habits: [
      { name: "Drink Water", icon: "Water" as HabitIconName },
      { name: "Morning Run", icon: "Run" as HabitIconName },
      { name: "Meditation", icon: "Brain" as HabitIconName },
      { name: "Read", icon: "Book" as HabitIconName },
      { name: "Sleep Early", icon: "Moon" as HabitIconName },
    ],
  },

  {
    label: "💪 Health & Fitness",
    habits: [
      { name: "Gym Session", icon: "Gym" as HabitIconName },
      { name: "Yoga", icon: "Yoga" as HabitIconName },
      { name: "Walk 10k Steps", icon: "Walk" as HabitIconName },
      { name: "No Sugar", icon: "Food" as HabitIconName },
      { name: "Stretching", icon: "Wind" as HabitIconName },
      { name: "Cold Shower", icon: "Water" as HabitIconName },
      { name: "Protein Intake", icon: "Gym" as HabitIconName },
    ],
  },

  {
    label: "🧠 Mindset & Growth",
    habits: [
      { name: "Journaling", icon: "Journal" as HabitIconName },
      { name: "Gratitude", icon: "Heart" as HabitIconName },
      { name: "Deep Work", icon: "Focus" as HabitIconName },
      { name: "Learn a Language", icon: "Globe" as HabitIconName },
      { name: "Daily Reflection", icon: "Brain" as HabitIconName },
      { name: "Affirmations", icon: "Sparkles" as HabitIconName },
      { name: "Read 20 Pages", icon: "Book" as HabitIconName },
    ],
  },

  {
    label: "💰 Finance & Productivity",
    habits: [
      { name: "Save Money", icon: "Money" as HabitIconName },
      { name: "Track Expenses", icon: "Receipt" as HabitIconName },
      { name: "Inbox Zero", icon: "Mail" as HabitIconName },
      { name: "Plan Tomorrow", icon: "Calendar" as HabitIconName },
      { name: "Focus Time", icon: "Timer" as HabitIconName },
      { name: "No Distractions", icon: "Flame" as HabitIconName },
    ],
  },

  {
    label: "⚡ Lifestyle",
    habits: [
      { name: "Wake Up Early", icon: "Sunrise" as HabitIconName },
      { name: "Limit Screen Time", icon: "Phone" as HabitIconName },
      { name: "Drink Coffee Mindfully", icon: "Coffee" as HabitIconName },
      { name: "Declutter Room", icon: "Trash" as HabitIconName },
      { name: "Walk Outside", icon: "Nature" as HabitIconName },
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
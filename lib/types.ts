export type Habit = {
  id: string;
  name: string;
  createdAt: Date | null;
};

export type Completion = {
  habitId: string;
  date: string; // "YYYY-MM-DD"
  completed: boolean | null;
};

export type HabitStats = {
  habitId: string;
  name: string;
  currentStreak: number;
  bestStreak: number;
};
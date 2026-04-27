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
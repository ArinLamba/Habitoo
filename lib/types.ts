export type Habit = {
  id: string;
  name: string;
  createdAt: string;
};

export type Completion = {
  habitId: string;
  date: string; // "YYYY-MM-DD"
  completed: boolean | null;
};
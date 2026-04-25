import { Habit } from "@/lib/types";
import { create } from "zustand";

type HabitStore = {
  selectedHabit: Habit | null;
  setSelectedHabit: (selectedHabit: Habit | null) => void;
};

export const useHabitStore = create<HabitStore>((set) => ({
  selectedHabit: null,
  setSelectedHabit: (habit) => set({ selectedHabit: habit}),
}));
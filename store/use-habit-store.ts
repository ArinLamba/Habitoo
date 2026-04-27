import { Habit } from "@/lib/types";
import { create } from "zustand";

type HabitStore = {
  habits: Habit[];
  selectedHabit: Habit | null;

  setHabits: (habits: Habit[]) => void;
  setSelectedHabit: (habit: Habit | null) => void;

  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, name: string) => void;
  deleteHabit: (id: string) => void;
  replaceHabit: (tempId: string, realHabit: Habit) => void;

  nextHabit: () => void;
  prevHabit: () => void;
};

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  selectedHabit: null,

  setHabits: (habits) => set({ habits }),

  setSelectedHabit: (habit) => set({ selectedHabit: habit }),

  addHabit: (habit) =>
    set((state) => ({
      habits: [...state.habits, habit],
    })),

  updateHabit: (id, name) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, name } : h
      ),
      selectedHabit:
        state.selectedHabit?.id === id
          ? { ...state.selectedHabit, name }
          : state.selectedHabit,
    })),

  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
      selectedHabit:
        state.selectedHabit?.id === id ? null : state.selectedHabit,
    })),

  nextHabit: () => {
    const { habits, selectedHabit } = get();
    if (!selectedHabit || habits.length === 0) return;

    const index = habits.findIndex(h => h.id === selectedHabit.id);
    const next = habits[(index + 1) % habits.length];

    set({ selectedHabit: next });
  },

  prevHabit: () => {
    const { habits, selectedHabit } = get();
    if (!selectedHabit || habits.length === 0) return;

    const index = habits.findIndex(h => h.id === selectedHabit.id);
    const prev = habits[(index - 1 + habits.length) % habits.length];

    set({ selectedHabit: prev });
  },

  replaceHabit: (tempId: string, realHabit: Habit) =>
    set((state) => ({
      habits: state.habits.map(h =>
        h.id === tempId ? realHabit : h
      )
    })),
}));
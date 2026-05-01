import { create } from "zustand";

type HabitStore = {
  selectedHabitId: string | null;

  setSelectedHabitId: (id: string | null) => void;

  nextHabit: (habitIds: string[]) => void;
  prevHabit: (habitIds: string[]) => void;
};

export const useHabitStore = create<HabitStore>((set, get) => ({
  selectedHabitId: null,

  setSelectedHabitId: (id) => set({ selectedHabitId: id }),

  nextHabit: (habitIds) => {
    const { selectedHabitId } = get();
    if (!selectedHabitId || habitIds.length === 0) return;

    const index = habitIds.indexOf(selectedHabitId);
    const next = habitIds[(index + 1) % habitIds.length];

    set({ selectedHabitId: next });
  },

  prevHabit: (habitIds) => {
    const { selectedHabitId } = get();
    if (!selectedHabitId || habitIds.length === 0) return;

    const index = habitIds.indexOf(selectedHabitId);
    const prev = habitIds[(index - 1 + habitIds.length) % habitIds.length];

    set({ selectedHabitId: prev });
  },
}));
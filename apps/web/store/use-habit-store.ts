import { create } from "zustand";

type HabitStore = {
  selectedHabitId: string | null;
  setSelectedHabitId: (id: string | null) => void;

};

export const useHabitStore = create<HabitStore>((set) => ({
  selectedHabitId: null,
  setSelectedHabitId: (id) => set({ selectedHabitId: id }),

}));
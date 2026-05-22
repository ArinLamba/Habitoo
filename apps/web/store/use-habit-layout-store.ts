import { create } from "zustand";

type HabitLayoutStore = {
  habitViewLayout: "grid" | "list";
  setHabitViewLayout: (habitViewLayout: "grid" | "list") => void;
};

export const usehabitViewLayoutStore = create<HabitLayoutStore>((set) => ({
  habitViewLayout: "grid",
  setHabitViewLayout: (data) => set({ habitViewLayout: data}),
}));
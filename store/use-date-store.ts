import { create } from "zustand";

type DateStore = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
};

export const useDateStore = create<DateStore>((set) => ({
  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),
}));
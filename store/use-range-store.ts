// use-range-store.ts
import { create } from "zustand";

export type Range = number | "all";

type RangeStore = {
  range: Range;
  setRange: (r: Range) => void;
};

export const useRangeStore = create<RangeStore>((set) => ({
  range: 90,
  setRange: (r) => set({ range: r }),
}));
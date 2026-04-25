import { create } from "zustand";

type ViewStore = {
  view: "heatmap" | "habit";
  setView: (view: "heatmap" | "habit") => void;
};

export const useViewStore = create<ViewStore>((set) => ({
  view: "heatmap",
  setView: (data) => set({ view: data}),
}));
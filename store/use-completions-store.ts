import { create } from "zustand";
import { Completion } from "@/lib/types";

type State = {
  completions: Completion[];
  setCompletions: (data: Completion[]) => void;
  toggleCompletion: (habitId: string, date: string) => void;
};

export const useCompletionsStore = create<State>((set) => ({
  completions: [],

  setCompletions: (data) => set({ completions: data }),

  toggleCompletion: (habitId, date) =>
    set((state) => {
      const exists = state.completions.find(
        (c) => c.habitId === habitId && c.date === date
      );

      if (exists) {
        return {
          completions: state.completions.map((c) =>
            c.habitId === habitId && c.date === date
              ? { ...c, completed: !c.completed }
              : c
          ),
        };
      }

      return {
        completions: [
          ...state.completions,
          { habitId, date, completed: true },
        ],
      };
    }),
}));
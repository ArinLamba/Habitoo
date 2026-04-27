
import { getNoteByDate } from "@/db/queries";
import { create } from "zustand";

type Note = {
  note: string;
  highlight: string;
};

type NoteStore = {
  notes: Record<string, Note>;
  loadingDates: Set<string>;

  fetchNote: (date: string) => Promise<void>;
  setNote: (date: string, note: string, highlight: string) => void;
};

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: {},
  loadingDates: new Set(),

  setNote: (date, note, highlight) =>
    set((state) => ({
      notes: {
        ...state.notes,
        [date]: { note, highlight },
      },
    })),

  fetchNote: async (date) => {
    const { notes, loadingDates } = get();

    if (notes[date] || loadingDates.has(date)) return; // 🔥 global guard

    loadingDates.add(date);

    const res = await getNoteByDate(date);

    set((state) => ({
      notes: {
        ...state.notes,
        [date]: {
          note: res?.note || "",
          highlight: res?.highlight || "",
        },
      },
      loadingDates: new Set([...loadingDates].filter(d => d !== date)),
    }));
  },
}));
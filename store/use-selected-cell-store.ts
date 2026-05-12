import { create } from "zustand";
type SelectedCell = {
  habitId: string;
  date: string;
};

type SelectedCellStore = {
  selectedCell: SelectedCell | null;

  setSelectedCell: (cell: SelectedCell) => void;

  clearSelectedCell: () => void;
};

export const useSelectedCellStore = create<SelectedCellStore>((set) => ({
  selectedCell: null,


  setSelectedCell: (newCell) =>
    set({selectedCell: newCell}),

  clearSelectedCell: () =>
    set({
      selectedCell: null
    }),
}));
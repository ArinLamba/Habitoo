import { create } from "zustand";

type DrawerModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useDrawerModal = create<DrawerModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
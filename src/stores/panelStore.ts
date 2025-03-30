// src/stores/panelStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PanelState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (value: boolean) => void;
}

export const usePanelStore = create<PanelState>()(
  persist(
    (set) => ({
      isOpen: true,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (value) => set({ isOpen: value }),
    }),
    {
      name: "panel-storage",
    }
  )
);

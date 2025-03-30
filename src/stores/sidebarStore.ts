// src/stores/sidebarStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (value: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true, // Estado inicial
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (value) => set({ isOpen: value }),
    }),
    {
      name: "sidebar-storage", // Clave en localStorage
    }
  )
);

// src/stores/menuStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuNode } from "@/hooks/useMenus"; // o cambia el path según dónde definas la interfaz

interface MenuStore {
  menus: MenuNode[];
  setMenus: (menus: MenuNode[]) => void;
  clearMenus: () => void;
}

// 🧠 Store persistente para mantener los menús tras F5
export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      menus: [],
      setMenus: (menus) => set({ menus }),
      clearMenus: () => set({ menus: [] }),
    }),
    {
      name: "menu-storage", // nombre en localStorage
    }
  )
);

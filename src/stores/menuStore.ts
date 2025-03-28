// src/stores/menuStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MenuNode {
  id: number;
  name: string;
  path: string;
  parentId: number | null;
  icon?: string;
  isActive?: boolean;
  children: MenuNode[];
}

interface MenuStore {
  menus: MenuNode[];
  menuLoaded: boolean;
  setMenus: (menus: MenuNode[]) => void;
  clearMenus: () => void;
  setMenuLoaded: (loaded: boolean) => void;
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      menus: [],
      menuLoaded: false,
      setMenus: (menus) => set({ menus }),
      clearMenus: () => set({ menus: [], menuLoaded: false }),
      setMenuLoaded: (loaded) => set({ menuLoaded: loaded }),
    }),
    {
      name: "menu-storage", // localStorage key
    }
  )
);

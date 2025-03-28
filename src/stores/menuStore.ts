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
  setMenus: (menus: MenuNode[]) => void;
  clearMenus: () => void;
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      menus: [],
      setMenus: (menus) => set({ menus }),
      clearMenus: () => set({ menus: [] }),
    }),
    {
      name: "menu-storage", // 🧠 clave en localStorage
    }
  )
);

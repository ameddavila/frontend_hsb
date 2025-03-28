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
  setMenuLoaded: (value: boolean) => void;
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      menus: [],
      menuLoaded: false,
      setMenus: (menus) => set({ menus }),
      clearMenus: () => set({ menus: [], menuLoaded: false }),
      setMenuLoaded: (value) => set({ menuLoaded: value }),
    }),
    {
      name: "menu-storage",
    }
  )
);

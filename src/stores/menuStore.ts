// src/stores/menuStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MenuNode {
  id: number;
  name: string;
  path: string;
  parentId: number | null;
  icon?: string;
  isActive?: boolean;
  children: MenuNode[];
}


interface MenuState {
  menus: any[];
  menuLoaded: boolean;
  collapsed: boolean; // 🆕
  setMenus: (menus: any[]) => void;
  setMenuLoaded: (loaded: boolean) => void;
  clearMenus: () => void;
  toggleCollapsed: () => void; // 🆕
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      menus: [],
      menuLoaded: false,
      collapsed: false,
      setMenus: (menus) => set({ menus }),
      setMenuLoaded: (menuLoaded) => set({ menuLoaded }),
      clearMenus: () => set({ menus: [], menuLoaded: false }),
      toggleCollapsed: () =>
        set((state) => ({ collapsed: !state.collapsed })),
    }),
    {
      name: 'menu-storage',
    }
  )
);


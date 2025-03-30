// src/stores/menuStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuNode  } from "@/types/Menu"; // ✅ Tipado base importado

interface MenuState {
  menus: MenuNode []; // Menús planos (lo que devuelve /menus)
  menuLoaded: boolean; // Ya se cargaron los menús
  collapsed: boolean; // Sidebar colapsado
  setMenus: (menus: MenuNode []) => void;
  setMenuLoaded: (loaded: boolean) => void;
  clearMenus: () => void;
  toggleCollapsed: () => void;
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
      name: "menu-storage", // localStorage key
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuNode } from "@/types/Menu";
import { fetchUserMenus } from "@/services/menuService"; // ✅ función correcta
import { transformMenus } from "@/utils/transformMenus";

interface MenuState {
  menus: MenuNode[];
  menuLoaded: boolean;
  collapsed: boolean;
  setMenus: (menus: MenuNode[]) => void;
  setMenuLoaded: (loaded: boolean) => void;
  clearMenus: () => void;
  toggleCollapsed: () => void;
  loadMenus: () => Promise<void>;
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

      loadMenus: async () => {
        try {
          console.log("📡 Cargando menús del usuario...");
          const rawMenus = await fetchUserMenus(); // ✅ función correcta
          const tree = transformMenus(rawMenus);
          set({ menus: tree, menuLoaded: true });
          console.log("✅ Menús cargados y transformados");
        } catch (error) {
          console.error("❌ Error al cargar menús desde el backend:", error);
        }
      },
    }),
    {
      name: "menu-storage", // clave para localStorage
    }
  )
);

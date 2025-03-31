import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuNode } from "@/types/Menu";
import { fetchUserMenus } from "@/services/menuService";
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
    (set, get) => ({
      menus: [],
      menuLoaded: false,
      collapsed: false,

      setMenus: (menus) => {
        set({ menus });
        console.log("📁 [menuStore] Menús seteados:", menus.length);
      },

      setMenuLoaded: (menuLoaded) => {
        set({ menuLoaded });
        console.log("🧠 [menuStore] Estado menuLoaded actualizado:", menuLoaded);
      },

      clearMenus: () => {
        set({ menus: [], menuLoaded: false });
        console.log("🧼 [menuStore] Menús limpiados");
      },

      toggleCollapsed: () =>
        set((state) => {
          const nuevoEstado = !state.collapsed;
          console.log("📐 [menuStore] Sidebar colapsado:", nuevoEstado);
          return { collapsed: nuevoEstado };
        }),

        loadMenus: async () => {
          try {
            console.log("📡 Cargando menús del usuario...");
            const rawMenus = await fetchUserMenus(); // ✅ esta apunta a /menus/my-menus
            const tree = transformMenus(rawMenus);
            set({ menus: tree, menuLoaded: true });
            console.log("✅ Menús cargados y transformados:", tree);
          } catch (error) {
            console.error("❌ Error al cargar menús desde el backend:", error);
          }
        }
        
    }),
    {
      name: "menu-storage",
      partialize: (state) => ({
        menus: state.menus,
        menuLoaded: state.menuLoaded,
        collapsed: state.collapsed,
      }),
    }
  )
);

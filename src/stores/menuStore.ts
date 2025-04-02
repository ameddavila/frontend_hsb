import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Menu, MenuNode } from "@/types/Menu";
import { fetchUserMenus } from "@/services/menuService";
import { transformMenus } from "@/utils/transformMenus";

interface MenuState {
  menus: MenuNode[];
  menuLoaded: boolean;
  collapsed: boolean;

  // Mutadores
  setMenus: (menus: MenuNode[]) => void;
  setMenuLoaded: (loaded: boolean) => void;
  clearMenus: () => void;
  toggleCollapsed: () => void;

  // Carga inicial desde backend
  loadMenus: () => Promise<void>;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, _get) => ({
      menus: [],
      menuLoaded: false,
      collapsed: false,

      /**
       * 📥 Guarda los menús transformados (MenuNode[])
       */
      setMenus: (menus) => {
        set({ menus });
        console.log("📁 [menuStore] Menús seteados:", menus.length);
      },

      /**
       * 🧠 Actualiza bandera de carga
       */
      setMenuLoaded: (menuLoaded) => {
        set({ menuLoaded });
        console.log("🧠 [menuStore] Estado menuLoaded actualizado:", menuLoaded);
      },

      /**
       * 🧹 Limpia los menús y estado de carga
       */
      clearMenus: () => {
        set({ menus: [], menuLoaded: false });
        console.log("🧼 [menuStore] Menús limpiados");
      },

      /**
       * 📐 Cambia el estado colapsado del Sidebar
       */
      toggleCollapsed: () =>
        set((state) => {
          const nuevoEstado = !state.collapsed;
          console.log("📐 [menuStore] Sidebar colapsado:", nuevoEstado);
          return { collapsed: nuevoEstado };
        }),

      /**
       * 🔄 Carga los menús del usuario desde el backend y los transforma a árbol
       */
      loadMenus: async () => {
        try {
          console.log("📡 [menuStore] Cargando menús desde el backend...");
          const rawMenus: Menu[] = await fetchUserMenus();
          const tree: MenuNode[] = transformMenus(rawMenus);

          set({ menus: tree, menuLoaded: true });
          console.log("✅ [menuStore] Menús cargados y transformados:", tree);
        } catch (error) {
          console.error("❌ [menuStore] Error al cargar menús:", error);
          set({ menus: [], menuLoaded: false });
        }
      },
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

// src/stores/useUserStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;

  // Getters de permisos
  isAdmin: () => boolean;
  hasRole: (role: string | string[]) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => {
        console.log("[UserStore] setUser =>", user);
        set({ user });
      },

      clearUser: () => {
        console.log("[UserStore] clearUser()");
        set({ user: null });
      },

      isAdmin: () => get().user?.role === "Administrador",

      hasRole: (roles) => {
        const currentRole = get().user?.role;
        if (!currentRole) return false;

        return Array.isArray(roles)
          ? roles.includes(currentRole)
          : roles === currentRole;
      },
    }),
    {
      name: "user-storage",
      version: 0, // En caso de que quieras manejar migraciones en un futuro
      // Solo persistimos la propiedad 'user' para no guardar getters
      partialize: (state) => ({ user: state.user }),
      // Opción útil para debug: logs durante la rehidratación
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("[UserStore] Error al rehidratar:", error);
        } else {
          console.log("[UserStore] Rehidratación completada. State:", state);
        }
      },
    }
  )
);

// src/stores/userStore.ts
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

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // ✅ Getter: ¿Es administrador?
      isAdmin: () => get().user?.role === "Administrador",

      // ✅ Getter: ¿Tiene uno de los roles indicados?
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
      partialize: (state) => ({ user: state.user }),
    }
  )
);

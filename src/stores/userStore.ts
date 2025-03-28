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
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // clave de localStorage
      partialize: (state) => ({ user: state.user }),
    }
  )
);

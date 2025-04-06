import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  openGroups: Record<string, boolean>;
  toggleGroup: (id: number) => void;
  isOpen: (id: number) => boolean;
  resetGroups: () => void;
  expandAll: (ids: number[]) => void;
  collapseAll: () => void;
  areAnyGroupsOpen: () => boolean;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      openGroups: {},

      toggleGroup: (id) => {
        const key = id.toString();
        const current = get().openGroups[key];
        set((state) => ({
          openGroups: { ...state.openGroups, [key]: !current },
        }));
      },

      isOpen: (id) => !!get().openGroups[id.toString()],

      resetGroups: () => {
        set({ openGroups: {} });
      },

      expandAll: (ids) => {
        const newState: Record<string, boolean> = {};
        ids.forEach((id) => {
          newState[id.toString()] = true;
        });
        set({ openGroups: newState });
      },

      collapseAll: () => {
        set({ openGroups: {} });
      },

      areAnyGroupsOpen: () => {
        return Object.values(get().openGroups).some((isOpen) => isOpen);
      },
    }),
    {
      name: 'sidebar-groups', // nombre en localStorage
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useHeaderStore = create(
  persist(
    (set) => ({
      // State
      title: "Search",
      isCollapsed: false,

      // Actions
      setTitle: (newTitle) => set({ title: newTitle }),
      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (value) => set({ isCollapsed: value }),
    }),
    {
      name: "header-store", // key in localStorage
    }
  )
);
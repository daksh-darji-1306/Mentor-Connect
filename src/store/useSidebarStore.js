import { create } from 'zustand';

const useSidebarStore = create((set) => ({
    isCollapsed: false,
    toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    setCollapsed: (isCollapsed) => set({ isCollapsed }),
}));

export default useSidebarStore;

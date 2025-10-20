import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // UI State
      sidebarOpen: true,
      darkMode: false,
      currentPage: 'dashboard',
      
      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // Toast notifications
      toasts: [],
      addToast: (toast) => set((state) => ({ 
        toasts: [...state.toasts, { ...toast, id: Date.now() }] 
      })),
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(toast => toast.id !== id)
      })),
    }),
    {
      name: 'gemstone-dashboard-storage',
    }
  )
);
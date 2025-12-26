import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // UI State
      sidebarOpen: true,
      darkMode: false,
      currentPage: 'dashboard',
      
      // Admin and Authentication
      isAuthenticated: false, // Default to false, updated on login
      isSuperAdmin: false, // Default to false, updated on login
      adminName: '', // New state for admin name

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setCurrentPage: (page) => set({ currentPage: page }),
      
      login: (isSuper, name) => set({ isAuthenticated: true, isSuperAdmin: isSuper, adminName: name }),
      logout: () => set({ isAuthenticated: false, isSuperAdmin: false, adminName: '' }),
      setIsSuperAdmin: (status) => set({ isSuperAdmin: status }),

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
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        isSuperAdmin: state.isSuperAdmin,
        adminName: state.adminName,
        darkMode: state.darkMode,
        sidebarOpen: state.sidebarOpen,
        currentPage: state.currentPage,
      }), // Persist these states
    }
  )
);
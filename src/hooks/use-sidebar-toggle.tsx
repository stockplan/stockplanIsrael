import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface useSidebarToggleStore {
  isOpen: boolean
  toggleIsOpen: () => void
  closeSidebar: () => void
  openSidebar: () => void
}

export const useSidebarToggle = create(
  persist<useSidebarToggleStore>(
    (set, get) => ({
      isOpen: true,
      toggleIsOpen: () => {
        set({ isOpen: !get().isOpen })
      },
      closeSidebar: () => {
        set({ isOpen: false })
      },
      openSidebar: () => {
        set({ isOpen: true })
      },
    }),
    {
      name: "sidebarOpen",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

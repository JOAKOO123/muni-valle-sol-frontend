import { create } from 'zustand'

interface UserLocation {
  lat: number
  lng: number
}

export type VistaDashboard = 'mapa' | 'dashboard'

interface AppState {
  darkMode: boolean
  toggleDarkMode: () => void
  userLocation: UserLocation | null
  setUserLocation: (location: UserLocation) => void
  vistaActiva: VistaDashboard
  setVistaActiva: (vista: VistaDashboard) => void
}

const useAppStore = create<AppState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
  vistaActiva: 'mapa',
  setVistaActiva: (vista) => set({ vistaActiva: vista }),
}))

export default useAppStore
import { create } from 'zustand'
import { Usuario } from '@/types/Usuario'

interface AuthState {
  usuario: Usuario | null
  isAuthenticated: boolean
  login: (usuario: Usuario) => void
  logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  isAuthenticated: false,
  login: (usuario) => set({ usuario, isAuthenticated: true }),
  logout: () => set({ usuario: null, isAuthenticated: false }),
}))

export default useAuthStore

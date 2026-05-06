import { create } from 'zustand'
import { Usuario } from '@/types/Usuario'

interface AuthState {
  token: string | null
  usuario: Usuario | null
  isAuthenticated: boolean
  login: (token: string, usuario: Usuario) => void
  logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  usuario: null,
  isAuthenticated: false,
  login: (token, usuario) => set({ token, usuario, isAuthenticated: true }),
  logout: () => set({ token: null, usuario: null, isAuthenticated: false }),
}))

export default useAuthStore

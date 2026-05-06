'use client'

import Link from 'next/link'
import useAppStore from '@/store/useAppStore'
import useAuthStore from '@/store/useAuthStore'

const Header = () => {
  const { darkMode, toggleDarkMode } = useAppStore()
  const { usuario, isAuthenticated, logout } = useAuthStore()

  return (
    <header className="w-full h-16 bg-gray-900 text-white flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">Municipalidad Valle del Sol</span>
        <span className="text-sm text-gray-400">| Gestion de Incendios</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="text-sm px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">{usuario?.nombre}</span>
            <button
              onClick={logout}
              className="text-sm text-red-400 hover:text-red-300 transition"
            >
              Cerrar sesion
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            Iniciar sesion
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header

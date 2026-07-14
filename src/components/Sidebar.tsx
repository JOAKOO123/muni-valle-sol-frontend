'use client'

import { useState } from 'react'
import useAppStore from '@/store/useAppStore'
import useAuthStore from '@/store/useAuthStore'

const Sidebar = () => {
  const { vistaActiva, setVistaActiva } = useAppStore()
  const { usuario, isAuthenticated, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const isAdmin = usuario?.rol === 'ADMIN'

  const handleNavigate = (vista: 'mapa' | 'dashboard') => {
    setVistaActiva(vista)
    setIsOpen(false)
  }

  return (
    <>
      {/* Boton hamburguesa — solo mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-gray-800/90 shadow-lg backdrop-blur"
        aria-label="Abrir menu"
      >
        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Overlay — solo mobile cuando esta abierto */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static top-0 left-0 z-40
        w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white
        flex flex-col py-6 px-4 shadow-2xl border-r border-gray-700/50
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Perfil superior */}
        <div className="flex flex-col items-center gap-3 border-b border-gray-700 pb-6 mb-6 mt-8 md:mt-0">
          {isAuthenticated ? (
            <>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl font-bold shadow-lg ring-2 ring-blue-400/30">
                {usuario?.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">{usuario?.nombre}</p>
                <p className="text-xs text-gray-400">{usuario?.rol}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">No has iniciado sesion</p>
              </div>
            </>
          )}
        </div>

        {/* Navegacion */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => handleNavigate('mapa')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              vistaActiva === 'mapa'
                ? 'bg-blue-600/90 text-white shadow'
                : 'text-gray-300 hover:bg-gray-700/60'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Mapa
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                vistaActiva === 'dashboard'
                  ? 'bg-blue-600/90 text-white shadow'
                  : 'text-gray-300 hover:bg-gray-700/60'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
              Dashboard
            </button>
          )}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Cerrar sesion o iniciar sesion */}
        <div className="border-t border-gray-700 pt-4">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="w-full px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-gray-700 transition text-left"
            >
              Cerrar sesion
            </button>
          ) : (
            <a
              href="/login"
              className="w-full block px-4 py-2 rounded-lg text-sm text-blue-400 hover:bg-gray-700 transition"
            >
              Iniciar sesion
            </a>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
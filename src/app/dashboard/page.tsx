'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import PanelAlertas from '@/components/PanelAlertas'
import TablaReportes from '@/components/TablaReportes'
import useDashboard from '@/hooks/useDashboard'
import useAlertaStore from '@/store/useAlertaStore'
import useAppStore from '@/store/useAppStore'

const MapaIncendios = dynamic(() => import('@/components/MapaIncendios'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
})

const DashboardPage = () => {
  const { reportes, loading, error } = useDashboard()
  const { alertasActivas } = useAlertaStore()
  const { darkMode } = useAppStore()

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Panel de Control
            </h1>
            {loading && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Actualizando...
              </span>
            )}
            {error && (
              <span className="text-sm text-red-500">
                Error al cargar datos
              </span>
            )}
          </div>

          <div className="flex gap-4 flex-1 overflow-hidden">
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <MapaIncendios reportes={reportes} />
            </div>

            <div className="w-72 bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-y-auto">
              <PanelAlertas alertas={alertasActivas} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
            <TablaReportes reportes={reportes} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage

'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import PanelAlertas from '@/components/PanelAlertas'
import TablaReportes from '@/components/TablaReportes'
import useAlertaStore from '@/store/useAlertaStore'
import useAppStore from '@/store/useAppStore'
import { obtenerReportes } from '@/services/reporteService'
import { obtenerAlertas } from '@/services/alertaService'
import { Reporte } from '@/types/Reporte'

const MapaIncendios = dynamic(() => import('@/components/MapaIncendios'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
})

const DashboardPage = () => {
  const { alertasActivas, setAlertasActivas } = useAlertaStore()
  const { darkMode } = useAppStore()
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [reportesData, alertasData] = await Promise.all([
        obtenerReportes(),
        obtenerAlertas(),
      ])
      setReportes(reportesData)
      setAlertasActivas(alertasData)
    } catch {
      setError('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`flex w-full ${darkMode ? 'dark' : ''}`}>
      <Sidebar />

      <main className="flex-1 flex flex-col p-4 gap-4 overflow-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Panel de Control
          </h1>
          {loading && (
            <span className="text-sm text-gray-500">Actualizando...</span>
          )}
          {error && (
            <span className="text-sm text-red-500">{error}</span>
          )}
        </div>

        <div className="flex gap-4" style={{ height: '500px' }}>
          <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
            <MapaIncendios reportes={reportes} />
          </div>

          <div className="w-72 bg-white rounded-lg shadow p-4 overflow-y-auto">
            <PanelAlertas alertas={alertasActivas} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <TablaReportes reportes={reportes} />
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
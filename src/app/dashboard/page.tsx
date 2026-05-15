'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import AlertPanel from '@/components/AlertPanel'
import ReportTable from '@/components/ReportTable'
import CreateAlertModal from '@/components/CreateAlertModal'
import useAlertStore from '@/store/useAlertStore'
import useAppStore from '@/store/useAppStore'
import useAuthStore from '@/store/useAuthStore'
import { obtenerReportes } from '@/services/reportService'
import { obtenerAlertas } from '@/services/alertService'
import { Report } from '@/types/Report'

const FireMap = dynamic(() => import('@/components/FireMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
})

const DashboardPage = () => {
  const { alertasActivas, setAlertasActivas } = useAlertStore()
  const { darkMode } = useAppStore()
  const { usuario } = useAuthStore()

  const [reportes, setReportes] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAlertModal, setShowAlertModal] = useState(false)

  const isCiudadano = usuario?.rol === 'CIUDADANO'

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
    <div className={`flex w-full min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar />

      <main className="flex-1 flex flex-col p-3 md:p-4 gap-4 overflow-auto md:ml-0">

        {/* Header del dashboard */}
        <div className="flex items-center justify-between mt-10 md:mt-0">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            Panel de Control
          </h1>
          <div className="flex items-center gap-3">
            {isCiudadano && (
              <button
                onClick={() => setShowAlertModal(true)}
                className="rounded-lg bg-red-600 px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Nueva Alerta
              </button>
            )}
            {loading && (
              <span className="text-xs md:text-sm text-gray-500">Actualizando...</span>
            )}
            {error && <span className="text-xs md:text-sm text-red-500">{error}</span>}
          </div>
        </div>

        {/* Mapa + Alertas */}
        <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: '420px' }}>
          <div className="flex-1 bg-white rounded-lg shadow overflow-hidden" style={{ minHeight: '320px' }}>
            <FireMap reports={reportes} />
          </div>

          <div className="w-full lg:w-72 bg-white rounded-lg shadow p-4 overflow-y-auto max-h-96 lg:max-h-none">
            <AlertPanel alerts={alertasActivas} />
          </div>
        </div>

        {/* Tabla de reportes */}
        <div className="bg-white rounded-lg shadow p-4">
          <ReportTable reportes={reportes} onReportesChange={setReportes} />
        </div>
      </main>

      {showAlertModal && (
        <CreateAlertModal
          onClose={() => setShowAlertModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}

export default DashboardPage
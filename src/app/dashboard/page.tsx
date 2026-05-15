'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import AlertPanel from '@/components/AlertPanel'
import ReportTable from '@/components/ReportTable'
import useAlertStore from '@/store/useAlertStore'
import useAppStore from '@/store/useAppStore'
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
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [reportsData, alertasData] = await Promise.all([
        obtenerReportes(),
        obtenerAlertas(),
      ])
      setReports(reportsData)
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
            <FireMap reports={reports} />
          </div>

          <div className="w-72 bg-white rounded-lg shadow p-4 overflow-y-auto">
            <AlertPanel alerts={alertasActivas} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <ReportTable reports={reports} />
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
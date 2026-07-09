'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import AlertPanel from '@/components/AlertPanel'
import ReportTable from '@/components/ReportTable'
import CreateAlertModal from '@/components/CreateAlertModal'
import CreateReportModal from '@/components/CreateReportModal'
import useAlertStore from '@/store/useAlertStore'
import useAppStore from '@/store/useAppStore'
import useAuthStore from '@/store/useAuthStore'
import useDashboard from '@/hooks/useDashboard'

const FireMap = dynamic(() => import('@/components/FireMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
})

const DashboardPage = () => {
  const { alertasActivas } = useAlertStore()
  const { darkMode, vistaActiva, setVistaActiva } = useAppStore()
  const { usuario } = useAuthStore()

  const isAdmin = usuario?.rol === 'ADMIN'

  const { reports: reportes, setReports: setReportes, loading, error, refetch } = useDashboard(isAdmin)

  const [showAlertModal, setShowAlertModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  // Solo el ADMIN puede ver la vista "dashboard" — si pierde el rol, volvemos al mapa
  useEffect(() => {
    if (!isAdmin && vistaActiva === 'dashboard') {
      setVistaActiva('mapa')
    }
  }, [isAdmin, vistaActiva, setVistaActiva])

  const mostrarDashboardAdmin = isAdmin && vistaActiva === 'dashboard'

  return (
    <div className={`flex w-full min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar />

      {/* Para ciudadano: main ocupa toda la altura y usa flex-col para que el mapa crezca */}
      <main
        className={`flex-1 flex flex-col p-3 md:p-4 gap-4 md:ml-0 ${
          mostrarDashboardAdmin ? 'overflow-auto' : 'h-screen overflow-hidden'
        }`}
      >
        {/* Header de la vista */}
        <div className="flex items-center justify-between mt-10 md:mt-0 flex-shrink-0">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            {mostrarDashboardAdmin ? 'Panel de Administracion' : 'Mapa de Alertas'}
          </h1>
          <div className="flex items-center gap-3">
            {mostrarDashboardAdmin && (
              <button
                onClick={() => setShowAlertModal(true)}
                className="rounded-lg bg-red-600 px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Nueva Alerta
              </button>
            )}
            {usuario && !isAdmin && (
              <button
                onClick={() => setShowReportModal(true)}
                className="rounded-lg bg-orange-600 px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Crear Reporte
              </button>
            )}
            {loading && (
              <span className="text-xs md:text-sm text-gray-500">Actualizando...</span>
            )}
            {error && <span className="text-xs md:text-sm text-red-500">{error}</span>}
          </div>
        </div>

        {mostrarDashboardAdmin ? (
          /* Vista Dashboard — solo ADMIN: gestion de reportes */
          <div className="bg-white rounded-lg shadow p-4">
            <ReportTable reportes={reportes} onReportesChange={setReportes} />
          </div>
        ) : (
          /* Vista Mapa — mapa + alertas activas */
          <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
            <div className="bg-white rounded-lg shadow overflow-hidden flex-1 min-h-0">
              <FireMap alerts={alertasActivas} />
            </div>

            <div className="w-full lg:w-72 bg-white rounded-lg shadow p-4 flex flex-col min-h-0 overflow-hidden">
              <AlertPanel alerts={alertasActivas} />
            </div>
          </div>
        )}
      </main>

      {showAlertModal && (
        <CreateAlertModal
          onClose={() => setShowAlertModal(false)}
          onSuccess={refetch}
        />
      )}

      {showReportModal && (
        <CreateReportModal
          onClose={() => setShowReportModal(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  )
}

export default DashboardPage
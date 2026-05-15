'use client'

import { Report } from '@/types/Report'

interface ReportTableProps {
  reports: Report[]
}

const colorEstado = (estado: string): string => {
  switch (estado) {
    case 'ACTIVO':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'EN_ATENCION':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'RESUELTO':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

const ReportTable = ({ reports }: ReportTableProps) => {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
        Reportes de Incendios
      </h2>

      {reports.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No hay reportes disponibles.
        </p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-2">Titulo</th>
              <th className="px-4 py-2">Comuna</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((reporte) => (
              <tr
                key={reporte.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2 font-medium text-gray-800 dark:text-white">
                  {reporte.titulo}
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                  {reporte.ubicacion?.comuna ?? '-'}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${colorEstado(reporte.estado)}`}>
                    {reporte.estado}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                  {reporte.fechaCreacion
                    ? new Date(reporte.fechaCreacion).toLocaleDateString('es-CL')
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ReportTable

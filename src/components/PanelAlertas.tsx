'use client'

import { Alerta } from '@/types/Alerta'

interface PanelAlertasProps {
  alertas: Alerta[]
}

const colorSeveridad = (severidad: string): string => {
  switch (severidad) {
    case 'ALTA':
      return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'MEDIA':
      return 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'BAJA':
      return 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 border-gray-400 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

const PanelAlertas = ({ alertas }: PanelAlertasProps) => {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto h-full">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">
        Alertas Activas
      </h2>

      {alertas.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No hay alertas activas en este momento.
        </p>
      ) : (
        alertas.map((alerta) => (
          <div
            key={alerta.id}
            className={`border-l-4 rounded p-3 text-sm ${colorSeveridad(alerta.severidad)}`}
          >
            <p className="font-semibold">{alerta.titulo}</p>
            <p className="text-xs mt-1">{alerta.descripcion}</p>
            <p className="text-xs mt-1 opacity-70">{alerta.fecha}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default PanelAlertas

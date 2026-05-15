import { Reporte } from '@/types/Reporte'

const BASE_URL = process.env.NEXT_PUBLIC_BFF_URL

export const obtenerReportes = async (): Promise<Reporte[]> => {
  const response = await fetch(`${BASE_URL}/api/reportes`, {
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Error al obtener reportes')
  }
  return response.json()
}

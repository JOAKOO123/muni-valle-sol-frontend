import { Alerta } from '@/types/Alerta'

const BASE_URL = process.env.NEXT_PUBLIC_BFF_URL

export const obtenerAlertas = async (): Promise<Alerta[]> => {
  const response = await fetch(`${BASE_URL}/api/alertas`, {
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Error al obtener alertas')
  }
  return response.json()
}

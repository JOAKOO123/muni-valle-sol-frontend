import { useState, useEffect } from 'react'
import { Reporte } from '@/types/Reporte'
import { obtenerReportes } from '@/services/reporteService'

interface UseReportesReturn {
  reportes: Reporte[]
  loading: boolean
  error: string | null
}

const useReportes = (): UseReportesReturn => {
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        setLoading(true)
        const data = await obtenerReportes()
        setReportes(data)
      } catch {
        setError('Error al obtener reportes')
      } finally {
        setLoading(false)
      }
    }
    fetchReportes()
  }, [])

  return { reportes, loading, error }
}

export default useReportes

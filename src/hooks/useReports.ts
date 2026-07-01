import { useState, useEffect, useCallback } from 'react'
import { Report } from '@/types/Report'
import { obtenerReportes } from '@/services/reportService'

interface UseReportsReturn {
  reports: Report[]
  setReports: (reports: Report[]) => void
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const useReports = (enabled: boolean = true): UseReportsReturn => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    const fetchReports = async () => {
      try {
        setLoading(true)
        const data = await obtenerReportes()
        setReports(data)
      } catch {
        setError('Error al obtener reportes')
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [enabled])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      const data = await obtenerReportes()
      setReports(data)
    } catch {
      setError('Error al obtener reportes')
    } finally {
      setLoading(false)
    }
  }, [])

  return { reports, setReports, loading, error, refetch }
}

export default useReports
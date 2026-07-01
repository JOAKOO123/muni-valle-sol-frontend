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

  const fetchReports = useCallback(async () => {
    if (!enabled) return
    try {
      setLoading(true)
      const data = await obtenerReportes()
      setReports(data)
    } catch {
      setError('Error al obtener reportes')
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return { reports, setReports, loading, error, refetch: fetchReports }
}

export default useReports
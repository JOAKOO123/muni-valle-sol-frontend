import { useState, useEffect, useCallback } from 'react'
import { obtenerAlertas } from '@/services/alertService'
import useAlertStore from '@/store/useAlertStore'

interface UseAlertsReturn {
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const useAlerts = (): UseAlertsReturn => {
  const { setAlertasActivas } = useAlertStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        setLoading(true)
        const data = await obtenerAlertas()
        setAlertasActivas(data)
      } catch {
        setError('Error al obtener alertas')
      } finally {
        setLoading(false)
      }
    }
    fetchAlertas()
  }, [setAlertasActivas])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      const data = await obtenerAlertas()
      setAlertasActivas(data)
    } catch {
      setError('Error al obtener alertas')
    } finally {
      setLoading(false)
    }
  }, [setAlertasActivas])

  return { loading, error, refetch }
}

export default useAlerts
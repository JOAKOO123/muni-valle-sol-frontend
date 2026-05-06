import { useState, useEffect } from 'react'
import { obtenerAlertas } from '@/services/alertaService'
import useAlertaStore from '@/store/useAlertaStore'

interface UseAlertasReturn {
  loading: boolean
  error: string | null
}

const useAlertas = (): UseAlertasReturn => {
  const { setAlertasActivas } = useAlertaStore()
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
  }, [])

  return { loading, error }
}

export default useAlertas

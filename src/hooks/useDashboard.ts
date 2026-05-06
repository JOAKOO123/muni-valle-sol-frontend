import useReportes from './useReportes'
import useAlertas from './useAlertas'

const useDashboard = () => {
  const { reportes, loading: loadingReportes, error: errorReportes } = useReportes()
  const { loading: loadingAlertas, error: errorAlertas } = useAlertas()

  return {
    reportes,
    loading: loadingReportes || loadingAlertas,
    error: errorReportes || errorAlertas,
  }
}

export default useDashboard

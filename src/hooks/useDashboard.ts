import { useEffect, useCallback } from 'react'
import useReports from './useReports'
import useAlerts from './useAlerts'

const POLL_INTERVAL_MS = 30000

const useDashboard = (isAdmin: boolean) => {
  const {
    reports,
    setReports,
    loading: loadingReports,
    error: errorReports,
    refetch: refetchReports,
  } = useReports(isAdmin)

  const { loading: loadingAlerts, error: errorAlerts, refetch: refetchAlerts } = useAlerts()

  const refetch = useCallback(async () => {
    await Promise.all([refetchAlerts(), isAdmin ? refetchReports() : Promise.resolve()])
  }, [refetchAlerts, refetchReports, isAdmin])

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [refetch])

  return {
    reports,
    setReports,
    loading: loadingReports || loadingAlerts,
    error: errorReports || errorAlerts,
    refetch,
  }
}

export default useDashboard
import { create } from 'zustand'
import { Alerta } from '@/types/Alerta'

interface AlertaState {
  alertasActivas: Alerta[]
  setAlertasActivas: (alertas: Alerta[]) => void
  agregarAlerta: (alerta: Alerta) => void
  limpiarAlertas: () => void
}

const useAlertaStore = create<AlertaState>((set) => ({
  alertasActivas: [],
  setAlertasActivas: (alertas) => set({ alertasActivas: alertas }),
  agregarAlerta: (alerta) =>
    set((state) => ({ alertasActivas: [...state.alertasActivas, alerta] })),
  limpiarAlertas: () => set({ alertasActivas: [] }),
}))

export default useAlertaStore

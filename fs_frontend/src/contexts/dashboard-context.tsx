import { createContext, ReactNode, useState } from "react"

type DashboardItemId = "monthly" | "recent"

type DashboardItem = {
  id: DashboardItemId
  label: string
}

type DashboardContextType = {
  dashboardItems: DashboardItem[]
  setDashboardItems: (items: DashboardItem[]) => void
}

export const DashboardContext = createContext({} as DashboardContextType)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([
    { id: "monthly", label: "Evolução Mensal" },
    { id: "recent", label: "Últimas movimentações" },
  ])

  return (
    <DashboardContext.Provider value={{ dashboardItems, setDashboardItems }}>
      {children}
    </DashboardContext.Provider>
  )
}

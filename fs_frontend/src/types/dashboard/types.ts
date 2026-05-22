import { Transaction } from "../transaction/types"

export type PieGraphData = {
  value: number
  color: string
  text: string
}

type MonthLabel =
  | "jan"
  | "fev"
  | "mar"
  | "abr"
  | "mai"
  | "jun"
  | "jul"
  | "ago"
  | "set"
  | "out"
  | "nov"
  | "dez"

export type LineGraphData = {
  value: number
  label: MonthLabel
}

export type DashboardData = {
  balance: number
  totalIncome: number
  totalExpense: number
  pieData: PieGraphData[]
  transactions: Transaction[]
}

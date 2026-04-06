export type TransactionType = "receita" | "despesa"

export type Transaction = {
  id: string
  date: string
  category: string
  description: string
  value: number
  type: TransactionType
}

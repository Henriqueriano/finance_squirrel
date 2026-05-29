// src/hooks/use-money.js
import { useFormat } from "@/src/contexts/format-context"
import { useCallback } from "react"

export const useMoney = () => {
  const { currentMoney, moneyTypes, setCurrentMoney } = useFormat()

  const formatMoney = useCallback(
    (value: any) => {
      const config = moneyTypes[currentMoney]

      return new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: config.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    },
    [currentMoney, moneyTypes],
  )

  return {
    formatMoney,
    currentMoney,
    setCurrentMoney,
    moneyOptions: Object.keys(moneyTypes),
  }
}

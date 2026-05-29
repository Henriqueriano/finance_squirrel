// src/contexts/FormatContext.jsx
import { months } from "@/src/constants/months.ts"
import { createContext, useContext, useState } from "react"

const FormatContext = createContext()

export const moneyTypes = {
  real: { locale: "pt-BR", currency: "BRL", symbol: "R$" },
  dolar: { locale: "en-US", currency: "USD", symbol: "$" },
}

export const dateFormats = {
  numeric: {
    type: "numeric",
    format: (date) => {
      return `${date.getMonth() + 1}/${date.getFullYear()}`
    },
  },
  nominal: {
    type: "nominal",
    format: (date) => {
      return `${months[date.getMonth()]}/${date.getFullYear()}`
    },
  },
}

export function FormatProvider({ children }) {
  const [currentMoney, setCurrentMoney] = useState("real")
  const [currentDateFormat, setCurrentDateFormat] = useState("nominal")

  return (
    <FormatContext.Provider
      value={{
        currentMoney,
        setCurrentMoney,
        currentDateFormat,
        setCurrentDateFormat,
        moneyTypes,
        dateFormats,
      }}
    >
      {children}
    </FormatContext.Provider>
  )
}

export const useFormat = () => useContext(FormatContext)

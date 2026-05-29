// src/hooks/use-date.js
import { useFormat } from "@/src/contexts/format-context"
import { useCallback } from "react"

export const useDate = () => {
  const { currentDateFormat, dateFormats, setCurrentDateFormat } = useFormat()

  const formatDate = useCallback(
    (date: any) => {
      if (!date) return ""

      const dateObj = date instanceof Date ? date : new Date(date)
      const formatter = dateFormats[currentDateFormat]

      return formatter.format(dateObj)
    },
    [currentDateFormat, dateFormats],
  )

  return {
    formatDate,
    currentDateFormat,
    setCurrentDateFormat,
    dateOptions: Object.keys(dateFormats),
  }
}

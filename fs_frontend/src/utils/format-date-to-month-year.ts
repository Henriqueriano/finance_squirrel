import { months } from "../constants/months"

export function formatDateToMonthYear(date: Date | string) {
  const d = new Date(date)
  const month = months[d.getMonth()]
  const captalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)

  return `${captalizedMonth}/${d.getFullYear()}`
}

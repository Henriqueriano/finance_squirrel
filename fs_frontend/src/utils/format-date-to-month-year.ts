export function formatDateToMonthYear(date: Date | string) {
  const d = new Date(date)

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ]

  return `${months[d.getMonth()]}/${d.getFullYear()}`
}

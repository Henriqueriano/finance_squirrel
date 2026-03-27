export const parseDate = (date: string) => {
  const [monthStr, year] = date.split("/")

  const months: Record<string, number> = {
    Jan: 0, Fev: 1, Mar: 2, Abr: 3, Mai: 4, Jun: 5,
    Jul: 6, Ago: 7, Set: 8, Out: 9, Nov: 10, Dez: 11
  }

  return new Date(Number(year), months[monthStr])
}
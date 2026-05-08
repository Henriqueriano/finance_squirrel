export function parseCurrencyToCents(value: string): number {
  const normalized = value.replace(",", ".").trim()
  const floatValue = Number(normalized)

  if (isNaN(floatValue)) {
    throw new Error(`Valor inválido: ${value}`)
  }

  return Math.round(floatValue * 100)
}

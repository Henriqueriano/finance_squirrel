export function roundUp(value: number, nearest: number) {
  return Math.ceil(value / nearest) * nearest
}

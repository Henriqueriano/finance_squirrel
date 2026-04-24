import { useTheme } from "@/src/contexts/theme-context"
import { themes } from "@/src/themes/themes"

export function useThemeColors() {
  const { theme } = useTheme()
  return themes[theme]
}

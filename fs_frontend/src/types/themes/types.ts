import { themes } from "@/src/themes/themes"
import { LucideIcon } from "lucide-react-native"

export type ThemeType = keyof typeof themes

export type ColorsType = (typeof themes)[ThemeType]

export type ThemeContextType = {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  colors: ColorsType
}

export type ThemeOption = {
  key: ThemeType
  label: string
  icon: LucideIcon
}

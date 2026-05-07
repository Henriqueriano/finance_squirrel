import { createContext, ReactNode, useMemo, useState } from "react"
import { themes } from "../themes/themes"
import { ThemeContextType, ThemeType } from "../types/themes/types"

export const ThemeContext = createContext({} as ThemeContextType)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("verde")

  const value = useMemo(() => {
    return {
      theme,
      setTheme,
      colors: themes[theme],
    }
  }, [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

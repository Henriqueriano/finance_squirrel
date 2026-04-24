import { createContext, ReactNode, useContext, useState } from "react"

type ThemeType = "claro" | "escuro" | "verde"

type ThemeContextType = {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

const ThemeContext = createContext({} as ThemeContextType)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("verde")

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

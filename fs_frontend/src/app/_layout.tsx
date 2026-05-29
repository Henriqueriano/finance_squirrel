import { FormatProvider } from "@/src/contexts/format-context"
import { ThemeProvider } from "@/src/contexts/theme-context"
import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AuthProvider } from "../contexts/auth-context"
import { DashboardProvider } from "../contexts/dashboard-context"
import "../global.css"

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DashboardProvider>
          <ThemeProvider>
            <FormatProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </FormatProvider>
          </ThemeProvider>
        </DashboardProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}

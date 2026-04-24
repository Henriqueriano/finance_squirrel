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
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </DashboardProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}

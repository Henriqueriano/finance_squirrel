import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AuthProvider } from "../contexts/auth-context"
import "../global.css"

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </GestureHandlerRootView>
  )
}

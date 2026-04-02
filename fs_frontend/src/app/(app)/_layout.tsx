import { useAuth } from "@/src/hooks/use-auth"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Redirect, Tabs, useRouter } from "expo-router"
import { Text, TouchableOpacity } from "react-native"

export default function TabLayout() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    return <Redirect href="/signin" />
  }

  return (
    <Tabs
      screenOptions={{
        // Header (barra superior)
        headerStyle: {
          backgroundColor: "#163832", // fundo do header
        },
        headerTintColor: "#fff", // cor de ícones e botão back
        headerTitleStyle: {
          color: "#fff", // cor do título
          fontWeight: "bold",
        },
        // Bottom (barra inferior)
        tabBarStyle: {
          backgroundColor: "#163832", // fundo da barra
          borderTopWidth: 0, // remove borda
          height: 80,
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#fff", // ícone/texto ativo
        tabBarInactiveTintColor: "#8EB69B", // ícone/texto inativo
      }}
    >
      <Tabs.Screen
        name="transaction-history"
        options={{
          title: "Histórico",
          headerTitle: "Histórico Financeiro",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-clear-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categorias",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="register-transaction"
        options={{
          title: "Registrar",
          headerTitle: "Registro de Transações",
          headerRight: () => (
            <TouchableOpacity className="bg-accent p-2 rounded-lg mr-2">
              <Text className="text-white">Salvar Transações</Text>
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="cash-register" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="financial-education"
        options={{
          title: "Educação",
          headerTitle: "Educação Financeira",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: `DashBoard - ${user?.name}`,
          headerRight: ({}) => (
            <TouchableOpacity
              className="mr-5"
              onPress={() => router.navigate("/settings")}
            >
              <FontAwesome name="gear" size={40} color="#8EB69B" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          href: null,
        }}
      />
    </Tabs>
  )
}

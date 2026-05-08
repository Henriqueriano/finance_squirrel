import { useAuth } from "@/src/hooks/use-auth"
import { useTheme } from "@/src/hooks/use-theme"
import { capitalizeFirstLetter } from "@/src/utils/capitalize-first-letter"
import { Redirect, Tabs, useRouter } from "expo-router"
import {
  BookmarkPlus,
  ChartNoAxesCombined,
  ClipboardClock,
  GraduationCap,
  House,
  Layers,
  Settings,
} from "lucide-react-native"
import { TouchableOpacity } from "react-native"

export default function TabLayout() {
  const { user, isAuthenticated } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()

  if (!isAuthenticated) {
    return <Redirect href="/signin" />
  }

  return (
    <Tabs
      screenOptions={{
        // Header (barra superior)
        headerStyle: {
          backgroundColor: colors.navigatorColor, // fundo do header
        },
        headerTintColor: "#fff", // cor de ícones e botão back
        headerTitleStyle: {
          color: colors.text, // cor do título
          fontWeight: "bold",
        },
        // Bottom (barra inferior)
        tabBarStyle: {
          backgroundColor: colors.navigatorColor, // fundo da barra
          borderTopWidth: 0, // remove borda
          height: 80,
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarActiveTintColor: colors.navIconActive, // ícone/texto ativo
        tabBarInactiveTintColor: colors.navIconDeactive, // ícone/texto inativo
      }}
    >
      <Tabs.Screen
        name="transaction-history"
        options={{
          title: "Histórico",
          headerTitle: "Histórico Financeiro",
          tabBarIcon: ({ color, size }) => (
            <ClipboardClock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="financial-insights"
        options={{
          title: "Análise",
          headerTitle: "Análise Financeira",
          tabBarIcon: ({ color, size }) => (
            <ChartNoAxesCombined size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categorias",
          tabBarIcon: ({ color, size }) => <Layers size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="register-transaction"
        options={{
          title: "Registrar",
          headerTitle: "Registro de Transações",
          tabBarIcon: ({ color, size }) => (
            <BookmarkPlus size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="financial-education"
        options={{
          title: "Educação",
          headerTitle: "Educação Financeira",
          tabBarIcon: ({ color, size }) => (
            <GraduationCap size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "DashBoard",
          headerTitle: `DashBoard - ${capitalizeFirstLetter(user?.name)}`,
          headerRight: ({}) => (
            <TouchableOpacity
              className="mr-5"
              onPress={() => router.navigate("/settings")}
            >
              <Settings size={40} color={colors.accent} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
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

import { useTheme } from "@/src/contexts/theme-context"
import { useAuth } from "@/src/hooks/use-auth"
import { useDashboard } from "@/src/hooks/use-dashboard"
import { useThemeColors } from "@/src/hooks/use-theme"
import { useRouter } from "expo-router"
import { LeafyGreen, LogOut, Menu, Moon, SunMedium } from "lucide-react-native"
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import DraggableFlatList from "react-native-draggable-flatlist"

type ThemeType = "claro" | "escuro" | "verde"

type ThemeOption = {
  key: ThemeType
  label: string
  icon: React.ReactNode
}
const themes: ThemeOption[] = [
  {
    key: "claro",
    label: "claro",
    icon: <SunMedium size={20} color="#fff" />,
  },
  {
    key: "escuro",
    label: "escuro",
    icon: <Moon size={20} color="#fff" />,
  },
  {
    key: "verde",
    label: "verde",
    icon: <LeafyGreen size={20} color="#fff" />,
  },
]

const dateFormat = [
  { key: "nominal", label: "Jan/2025" },
  { key: "numerico", label: "01/2025" },
]

const moneyType = [
  { key: "real", label: "R$" },
  { key: "dolar", label: "$" },
  { key: "euro", label: "€" },
]

export default function SettingsScreen() {
  const { signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const colors = useThemeColors()
  const { dashboardItems, setDashboardItems } = useDashboard()
  const [selectedTheme, setSelectedTheme] = useState("light")
  const [selectedTypeMoney, setSelectedTypeMoney] = useState("real")
  const [selectedDateFormat, setSelectedDateFormat] = useState("nominal")

  const router = useRouter()

  return (
    <View
      className="flex-1 p-2 gap-4"
      style={{ backgroundColor: colors.background }}
    >
      <Text className="text-2xl font-bold mt-2" style={{ color: colors.text }}>
        Personalização:
      </Text>

      <View
        className="p-3 rounded-lg gap-4"
        style={{ backgroundColor: colors.card }}
      >
        {/* Temas */}
        <View className="flex-row items-center gap-2">
          <Text className="flex-1/3 text-xl" style={{ color: colors.text }}>
            Tema:
          </Text>
          <View className="flex-1 flex-row gap-2">
            {themes.map((tm) => (
              <TouchableOpacity
                key={tm.key}
                onPress={() => setTheme(tm.key)}
                className={`flex-row items-center justify-center p-2 rounded-lg gap-2 flex-1`}
                style={
                  theme === tm.key
                    ? { backgroundColor: colors.accent }
                    : { backgroundColor: "transparent" }
                }
              >
                <Text style={{ color: colors.text }}>{tm.label}</Text>
                {tm.icon}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="h-1 bg-black/70 rounded-lg" />

        {/* Moeda */}
        <View className="flex-row items-center gap-2">
          <Text className="flex-1/3 text-white text-xl">Moeda:</Text>
          <View className="flex-1 flex-row gap-2">
            {moneyType.map((money) => (
              <TouchableOpacity
                key={money.key}
                onPress={() => setSelectedTypeMoney(money.key)}
                className={`flex-1 flex-row items-center justify-center py-2 rounded-lg ${
                  selectedTypeMoney === money.key
                    ? "bg-accent"
                    : "bg-transparent"
                }`}
              >
                <Text className="text-white">{money.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="h-1 bg-black/70 rounded-lg" />

        {/* Formato data */}
        <View className="flex-row items-center gap-2">
          <Text className="flex-1/3 text-white text-xl">Formato de Data:</Text>
          <View className="flex-1 flex-row gap-2">
            {dateFormat.map((format) => (
              <TouchableOpacity
                key={format.key}
                onPress={() => setSelectedDateFormat(format.key)}
                className={`flex-1 flex-row items-center justify-center py-2 rounded-lg gap-1 ${
                  selectedDateFormat === format.key
                    ? "bg-accent"
                    : "bg-transparent"
                }`}
              >
                <Text className="text-white">{format.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="h-1 bg-black/70 rounded-lg" />

        {/* Ordem dashboard */}
        <View className="bg-cardrounded-xl gap-2">
          <Text className="text-white text-xl">Organização do dashboard:</Text>

          <DraggableFlatList
            data={dashboardItems}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => setDashboardItems(data)}
            activationDistance={10}
            contentContainerStyle={{ paddingTop: 5 }}
            renderItem={({ item, drag, isActive }) => (
              <TouchableOpacity
                onPressIn={drag}
                activeOpacity={0.8}
                className={`flex-row items-center justify-between p-4 rounded-xl mt-2 ${
                  isActive ? "bg-accent" : "bg-background"
                }`}
              >
                <View className="flex-row items-center gap-2">
                  <Menu size={20} color="#aaa" />
                  <Text className="text-white text-base">{item.label}</Text>
                </View>
                <Menu size={20} color="#aaa" />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Btn logout */}
      <TouchableOpacity
        className="flex-row items-center gap-2 bg-[#912F40] p-4 rounded-lg"
        onPress={() => {
          signOut()
          router.navigate("/signin")
        }}
      >
        <Text className="text-white text-xl">Sair</Text>
        <LogOut size={30} color="#FE4A49" />
      </TouchableOpacity>

      {/* Salvar alterações */}
      <TouchableOpacity className="flex-row items-center bg-accent px-2 py-4 rounded-lg absolute bottom-2 right-2 gap-4">
        <Text className="text-white">Confirmar Alterações</Text>
      </TouchableOpacity>
    </View>
  )
}

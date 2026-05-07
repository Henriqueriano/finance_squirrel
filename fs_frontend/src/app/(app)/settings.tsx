import { dateFormat } from "@/src/constants/date-format"
import { moneyType } from "@/src/constants/money-type"
import { themesOptions } from "@/src/constants/theme-options"
import { useAuth } from "@/src/hooks/use-auth"
import { useDashboard } from "@/src/hooks/use-dashboard"
import { useTheme } from "@/src/hooks/use-theme"
import { useRouter } from "expo-router"
import { LogOut, Menu } from "lucide-react-native"
import { useMemo, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import DraggableFlatList from "react-native-draggable-flatlist"

export default function SettingsScreen() {
  const { signOut } = useAuth()
  const { theme, setTheme, colors } = useTheme()
  const { dashboardItems, setDashboardItems } = useDashboard()
  const [selectedTheme, setSelectedTheme] = useState("claro")
  const [selectedTypeMoney, setSelectedTypeMoney] = useState("real")
  const [selectedDateFormat, setSelectedDateFormat] = useState("nominal")

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.background,
        },
        card: {
          backgroundColor: colors.card,
        },
        text: {
          color: colors.text,
        },
      }),
    [colors],
  )

  const router = useRouter()

  return (
    <View className="flex-1 p-2 gap-4" style={styles.container}>
      <Text className="text-2xl font-bold mt-2" style={styles.text}>
        Personalização:
      </Text>

      <View className="p-3 rounded-lg gap-4" style={styles.card}>
        {/* Temas */}
        <View className="flex-row items-center gap-2">
          <Text className="flex-1/3 text-xl" style={styles.text}>
            Tema:
          </Text>
          <View className="flex-1 flex-row gap-2">
            {themesOptions.map((tm) => {
              const Icon = tm.icon
              const isActive = theme === tm.key

              return (
                <TouchableOpacity
                  key={tm.key}
                  onPress={() => setTheme(tm.key)}
                  className="flex-row items-center justify-center p-2 rounded-lg gap-2 flex-1"
                  style={{
                    backgroundColor: isActive ? colors.btn : "transparent",
                  }}
                >
                  <Icon size={20} color={colors.text} />
                  <Text style={styles.text}>{tm.label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View className="h-1 bg-black/70 rounded-lg" />

        {/* Moeda */}
        <View className="flex-row items-center gap-2">
          <Text className="flex-1/3 text-xl" style={styles.text}>
            Moeda:
          </Text>
          <View className="flex-1 flex-row gap-2">
            {moneyType.map((money) => (
              <TouchableOpacity
                key={money.key}
                onPress={() => setSelectedTypeMoney(money.key)}
                className="flex-1 flex-row items-center justify-center py-2 rounded-lg"
                style={{
                  backgroundColor:
                    selectedTypeMoney === money.key
                      ? colors.btn
                      : "transparent",
                }}
              >
                <Text style={styles.text}>{money.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="h-1 bg-black/70 rounded-lg" />

        {/* Formato data */}
        <View className="flex-row items-center gap-2">
          <Text className="flex-1/3 text-xl" style={styles.text}>
            Formato de Data:
          </Text>
          <View className="flex-1 flex-row gap-2">
            {dateFormat.map((format) => (
              <TouchableOpacity
                key={format.key}
                onPress={() => setSelectedDateFormat(format.key)}
                className="flex-1 flex-row items-center justify-center py-2 rounded-lg gap-1"
                style={{
                  backgroundColor:
                    selectedDateFormat === format.key
                      ? colors.btn
                      : "transparent",
                }}
              >
                <Text style={styles.text}>{format.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="h-1 bg-black/70 rounded-lg" />

        {/* Ordem dashboard */}
        <View className="rounded-xl gap-2" style={styles.card}>
          <Text className="text-xl" style={styles.text}>
            Organização do dashboard:
          </Text>

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
                className="flex-row items-center justify-between p-4 rounded-xl mt-2"
                style={{
                  backgroundColor: isActive ? colors.accent : colors.draggable,
                }}
              >
                <View className="flex-row items-center gap-2">
                  <Menu size={20} color="#aaa" />
                  <Text className="text-base" style={{ color: colors.text }}>
                    {item.label}
                  </Text>
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
        <LogOut size={30} color="#FE4A49" />
        <Text className="text-xl text-white">Sair</Text>
      </TouchableOpacity>
    </View>
  )
}

import { Ionicons } from "@expo/vector-icons"
import AntDesign from "@expo/vector-icons/AntDesign"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import DraggableFlatList from "react-native-draggable-flatlist"

export default function SettingsScreen() {
  const [selectedTheme, setSelectedTheme] = useState("light")
  const [selectedTypeMoney, setSelectedTypeMoney] = useState("real")
  const [selectedDateFormat, setSelectedDateFormat] = useState("nominal")

  const themes = [
    { key: 'light', label: 'claro', icon: <FontAwesome5 name="sun" size={20} color="#fff" /> },
    { key: 'dark', label: 'escuro', icon: <AntDesign name="moon" size={20} color="#fff" /> },
    { key: 'green', label: 'verde', icon: <FontAwesome5 name="leaf" size={20} color="#fff" /> },
  ]
  const moneyType = [
    { key: "real", label: "R$"},
    { key: "dolar", label: "$"},
    { key: "euro", label: "€"}
  ]
  const dateFormat = [
    { key: "nominal", label: "Jan/2025"},
    { key: "numerico", label: "01/2025"}
  ]
  const [dashboardItems, setDashboardItems] = useState([
    { id: "category", label: "Gastos por categoria" },
    { id: "monthly", label: "Evolução Mensal" },
    { id: "recent", label: "Últimas movimentações" },
  ])
  const router = useRouter()

  return (
    <View className="flex-1 bg-background p-5 gap-5">
      <Text className="text-2xl text-white font-bold">Personalização:</Text>

      <View className="bg-card p-3 rounded-lg gap-4">
        
        <View className='flex-row items-center gap-5'>
          <Text className="text-white text-xl">Tema:</Text>
          <View className="flex-row gap-2">
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.key}
                onPress={() => setSelectedTheme(theme.key)}
                className={`flex-row items-center px-2 py-2 rounded-lg gap-1 ${
                  selectedTheme === theme.key ? 'bg-accent' : 'bg-transparent'
                }`}
              >
                <Text className="text-white">{theme.label}</Text>
                {theme.icon}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className='flex-row items-center gap-5'>
          <Text className="text-white text-xl">Moeda:</Text>
          <View className="flex-row gap-2">
            {moneyType.map((money) => (
              <TouchableOpacity
                key={money.key}
                onPress={() => setSelectedTypeMoney(money.key)}
                className={`flex-row items-center px-5 py-2 rounded-lg gap-1 ${
                  selectedTypeMoney === money.key ? 'bg-accent' : 'bg-transparent'
                }`}
              >
                <Text className="text-white">{money.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>

        <View className='flex-row items-center gap-2'>
          <Text className="text-white text-xl">Formato de Data:</Text>
          <View className="flex-row gap-2">
            {dateFormat.map((format) => (
              <TouchableOpacity
                key={format.key}
                onPress={() => setSelectedDateFormat(format.key)}
                className={`flex-row items-center px-5 py-2 rounded-lg gap-1 ${
                  selectedDateFormat === format.key ? 'bg-accent' : 'bg-transparent'
                }`}
              >
                <Text className="text-white">{format.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>

        <View className="bg-cardrounded-xl gap-2">
          <Text className="text-white text-xl">
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
                className={`flex-row items-center justify-between p-4 rounded-xl mt-2 ${
                  isActive ? "bg-accent" : "bg-background"
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="menu" size={20} color="#aaa" />
                  <Text className="text-white text-base">
                    {item.label}
                  </Text>
                </View>

                <Ionicons name="reorder-three-outline" size={22} color="#aaa" />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <TouchableOpacity className="flex-row items-center gap-2 bg-[#912F40] p-4 rounded-lg" onPress={() => router.navigate("/signin")}>
        <Text className="text-white text-xl">Sair</Text>
        <MaterialIcons name="exit-to-app" size={30} color="#FE4A49" />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center bg-accent px-4 py-3 rounded-lg absolute bottom-5 right-5 gap-2"
      >
        <Text className="text-white">Confirmar Alterações</Text>
        <FontAwesome5 name="save" size={24} color="#235347" />
      </TouchableOpacity>
    </View>
  );
}

import TransactionTable from "@/src/components/transaction-table"
import {
  DashboardData,
  LineGraphData,
  PieGraphData,
} from "@/src/types/dashboard/types"
import { Transaction } from "@/src/types/transaction/types"
import { Link } from "expo-router"
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChevronRight,
  Landmark,
} from "lucide-react-native"
import { useEffect, useState } from "react"
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { LineChart, PieChart } from "react-native-gifted-charts"

const pieData: PieGraphData[] = [
  { value: 54, color: "#177AD5", text: "abacate" },
  { value: 40, color: "#79D2DE", text: "banana" },
  { value: 20, color: "#ED6665", text: "uva" },
  { value: 200, color: "#0ac009", text: "melancia" },
]

const lineData1: LineGraphData[] = [
  { value: 1200, label: "jan" },
  { value: 900, label: "fev" },
  { value: 1600, label: "mar" },
  { value: 2000, label: "abr" },
  { value: 1000, label: "mai" },
  { value: 1500, label: "jun" },
  { value: 1700, label: "jul" },
  { value: 1750, label: "ago" },
  { value: 1700, label: "set" },
  { value: 1200, label: "out" },
  { value: 1900, label: "nov" },
  { value: 2100, label: "dez" },
]

const lineData2: LineGraphData[] = [
  { value: 800, label: "jan" },
  { value: 1100, label: "fev" },
  { value: 1300, label: "mar" },
  { value: 950, label: "abr" },
  { value: 1400, label: "mai" },
  { value: 1200, label: "jun" },
  { value: 1600, label: "jul" },
  { value: 1800, label: "ago" },
  { value: 1500, label: "set" },
  { value: 1700, label: "out" },
  { value: 2000, label: "nov" },
  { value: 2300, label: "dez" },
]

const data: Transaction[] = [
  {
    id: "1",
    date: "Jun/2026",
    category: "Alimentação",
    description: "...",
    value: 10,
    type: "despesa",
  },
  {
    id: "2",
    date: "Dez/2025",
    category: "Jogos",
    description: "Minecraft",
    value: 109.9,
    type: "despesa",
  },
  {
    id: "3",
    date: "Jan/2026",
    category: "Alimentação",
    description: "Arroz, Feijão",
    value: 17.9,
    type: "despesa",
  },
  {
    id: "4",
    date: "Abr/2025",
    category: "Alimentação",
    description: "Macarrão, Leite",
    value: 9.5,
    type: "despesa",
  },
  {
    id: "5",
    date: "Fev/2026",
    category: "Transporte",
    description: "Uber",
    value: 23.4,
    type: "despesa",
  },
]

const mockDashboardData: DashboardData = {
  balance: 3000,
  totalIncome: 2000,
  totalExpense: 2000,
  pieData,
  lineData1,
  lineData2,
  transactions: data,
}

export default function Index() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(mockDashboardData)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  async function fetchDashboardData() {
    try {
      setLoading(true)

      // 🔴 FUTURO: substituir por fetch real
      // const response = await api.get("/dashboard")
      // setDashboardData(response.data)

      // 🟢 TEMPORÁRIO (simulando backend)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDashboardData(mockDashboardData)
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const total = dashboardData.pieData.reduce((acc, item) => acc + item.value, 0)

  const relativeDataPercent = dashboardData.pieData.map((item) => ({
    ...item,
    value: (item.value / total) * 100,
    text: ((item.value / total) * 100).toFixed(2) + "%",
  }))

  return (
    <>
      <ScrollView className="flex-1">
        <View className="flex-1 bg-background justify-center p-5 gap-2">
          {/* Saldo e Tot. Receita/Despesa */}
          <View className="flex-1 flex-row justify-between gap-2">
            <View className="flex-1 flex-row items-center justify-around bg-card rounded-lg p-2">
              <Landmark size={40} color={"#DAF1DE"} />
              {/* Saldo */}
              <View>
                <Text className="font-bold text-sm text-white">Saldo</Text>
                <Text className="text-2xl text-white">
                  R${dashboardData.balance.toFixed(2)}
                </Text>
                <Link href="/transaction-history">
                  <View className="flex-row items-center">
                    <Text className="text-accent">Ver histórico</Text>
                    <ChevronRight size={14} color={"#8EB69B"} />
                  </View>
                </Link>
              </View>
            </View>

            {/* Total Receita/Despesa */}
            <View className="flex-1 bg-card rounded-lg p-2 gap-2">
              <View className="flex-row gap-3">
                <BanknoteArrowUp size={30} color={"#8EB69B"} />
                <View>
                  <Text className="text-white font-bold">Total Receitas</Text>
                  <Text className="text-white">
                    R${dashboardData.totalIncome.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <BanknoteArrowDown size={30} color={"#DB5461"} />
                <View>
                  <Text className="text-white font-bold">Total Despesas</Text>
                  <Text className="text-white">
                    R${dashboardData.totalExpense.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Gastos por categoria (Mês) */}
          <Text className="text-2xl text-white font-bold mt-5">
            Gastos por Categoria (Mês)
          </Text>
          <View className="flex-row bg-card rounded-lg items-center gap-5 p-5">
            <PieChart
              radius={100}
              data={relativeDataPercent}
              showText
              textColor="#fff"
              textSize={14}
              strokeWidth={2}
              strokeColor="#333"
            />
            <FlatList
              data={dashboardData.pieData}
              contentContainerStyle={{ gap: 5 }}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="flex-row gap-2">
                  <View
                    style={{
                      backgroundColor: item.color,
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                    }}
                  ></View>
                  <Text className="text-white">{item.text}</Text>
                </View>
              )}
            />
          </View>

          {/* Evolução Mensal */}
          <Text className="text-2xl text-white font-bold mt-5">
            Evolução Mensal (2026)
          </Text>
          <View className="bg-card rounded-lg p-5">
            <LineChart
              data={dashboardData.lineData1}
              data2={dashboardData.lineData2}
              width={250}
              color1="skyblue"
              color2="orange"
              dataPointsHeight={6}
              dataPointsWidth={6}
              dataPointsColor1="blue"
              dataPointsColor2="red"
              textFontSize={13}
              maxValue={2500}
              noOfSections={5}
              stepValue={500}
              xAxisColor="#fff"
              yAxisColor="#fff"
              xAxisLabelTextStyle={{ color: "#fff", fontSize: 12 }}
              yAxisTextStyle={{ color: "#fff", fontSize: 10 }}
              yAxisLabelPrefix="R$"
            />
          </View>

          {/* Últimas Movimentações */}
          <Text className="text-2xl text-white font-bold mt-5">
            Últimas Movimentações (Mês)
          </Text>
          <TransactionTable data={dashboardData.transactions} />
        </View>

        {/* Modal para Transação Rápida */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <TouchableOpacity
            className="flex-1 justify-center items-center bg-black/50"
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          >
            <TouchableOpacity activeOpacity={1} className="w-[90%]">
              <View className="bg-card p-5 rounded-2xl gap-4">
                <Text className="text-white text-xl font-bold">Modal</Text>

                {/* Botões */}
                <View className="flex-row items-center justify-end gap-3 mt-3">
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false)
                    }}
                  >
                    <Text className="text-white">Sair</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-accent p-5 rounded-lg"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white">Transação rápida +</Text>
      </TouchableOpacity>
    </>
  )
}

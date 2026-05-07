import { InputField } from "@/src/components/input-field"
import TransactionTable from "@/src/components/transaction-table"
import { useDashboard } from "@/src/hooks/use-dashboard"
import { useTheme } from "@/src/hooks/use-theme"
import {
  DashboardData,
  LineGraphData,
  PieGraphData,
} from "@/src/types/dashboard/types"
import { Transaction } from "@/src/types/transaction/types"
import { formatCurrency } from "@/src/utils/format-currency"
import { Link } from "expo-router"
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChevronRight,
  Landmark,
  Plus,
} from "lucide-react-native"
import { JSX, useEffect, useMemo, useState } from "react"
import {
  Modal,
  ScrollView,
  StyleSheet,
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

type DashboardItemId = "category" | "monthly" | "recent"

export default function Index() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(mockDashboardData)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const { dashboardItems } = useDashboard()

  const { colors } = useTheme()
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
        anchor: {
          color: colors.anchor,
        },
        btn: {
          backgroundColor: colors.btn,
        },
      }),
    [colors],
  )

  const dashboardComponents: Record<DashboardItemId, () => JSX.Element> = {
    category: () => (
      <>
        <Text className="text-2xl font-bold mt-5" style={styles.text}>
          Gastos por Categoria (Mês)
        </Text>
        <View
          className="flex-row rounded-lg items-center gap-5 p-5 mt-2"
          style={styles.card}
        >
          <PieChart
            radius={100}
            data={relativeDataPercent}
            showText
            textColor={colors.text}
            textSize={14}
            strokeWidth={2}
            strokeColor="#333"
          />
          <View className="flex-1 gap-2">
            {dashboardData.pieData.map((item, index) => (
              <View
                key={index}
                className="flex-row gap-2"
                style={{ marginBottom: 5 }}
              >
                <View
                  style={{
                    backgroundColor: item.color,
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                  }}
                />
                <Text style={styles.text}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </>
    ),

    monthly: () => (
      <>
        <Text className="text-2xl font-bold mt-5" style={styles.text}>
          Evolução Mensal (2026)
        </Text>
        <View className="rounded-lg p-5 mt-2" style={styles.card}>
          <View className="flex-1 flex-row justify-center mb-5 gap-5">
            <View className="flex-row gap-2">
              <View className="h-5 w-5 bg-sky-300 rounded-md" />
              <Text style={styles.text}>Receita</Text>
            </View>

            <View className="flex-row gap-2">
              <View className="h-5 w-5 bg-orange-400 rounded-md" />
              <Text style={styles.text}>Despesa</Text>
            </View>
          </View>

          <LineChart
            data={dashboardData.lineData1}
            data2={dashboardData.lineData2}
            width={280}
            color1="skyblue"
            color2="orange"
            dataPointsHeight={6}
            dataPointsWidth={6}
            dataPointsColor1="blue"
            dataPointsColor2="red"
            textFontSize={12}
            backgroundColor={"rgb(0 0 0 / 0.7)"}
            // X axis
            xAxisColor={colors.text}
            xAxisLabelTextStyle={{ color: colors.text, fontSize: 12 }}
            // Y axis
            noOfSections={5}
            stepValue={500}
            maxValue={2500}
            yAxisColor={colors.text}
            yAxisTextStyle={{ color: colors.text, fontSize: 10 }}
            yAxisLabelWidth={40}
            yAxisLabelPrefix="R$ "
          />
        </View>
      </>
    ),

    recent: () => (
      <>
        <Text className="text-2xl font-bold mt-5" style={styles.text}>
          Últimas Movimentações (Mês)
        </Text>
        <TransactionTable data={dashboardData.transactions} />
      </>
    ),
  }

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
        <View className="flex-1 justify-center p-2" style={styles.container}>
          {/* Saldo e Tot. Receita/Despesa */}
          <View className="flex-1 flex-row justify-between gap-2">
            {/* Saldo */}
            <View
              className="flex-1 flex-row items-center rounded-lg p-2 gap-2"
              style={styles.card}
            >
              <Landmark size={60} color={colors.text} />
              <View>
                <Text className="font-bold text-sm" style={styles.text}>
                  Saldo
                </Text>
                <Text className="text-3xl" style={styles.text}>
                  {formatCurrency(dashboardData.balance)}
                </Text>
                <Link href="/transaction-history">
                  <View className="flex-row items-center">
                    <Text style={styles.anchor}>Ver histórico</Text>
                    <ChevronRight size={14} color={colors.anchor} />
                  </View>
                </Link>
              </View>
            </View>

            {/* Total Receita/Despesa */}
            <View className="rounded-lg p-2 gap-2" style={styles.card}>
              <View className="flex-row gap-3">
                <BanknoteArrowUp size={30} color={"#8EB69B"} />
                <View>
                  <Text className="font-bold text-sm" style={styles.text}>
                    Total Receitas
                  </Text>
                  <Text style={styles.text}>
                    {formatCurrency(dashboardData.totalIncome)}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <BanknoteArrowDown size={30} color={"#DB5461"} />
                <View>
                  <Text className="font-bold text-sm" style={styles.text}>
                    Total Despesas
                  </Text>
                  <Text style={styles.text}>
                    {formatCurrency(dashboardData.totalExpense)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {dashboardItems.map((item) => {
            const Component = dashboardComponents[item.id]
            if (!Component) return null
            return <View key={item.id}>{Component?.()}</View>
          })}
        </View>
      </ScrollView>

      {/* Transação rápida */}
      <TouchableOpacity
        className="flex-row items-center gap-2 absolute bottom-2 right-2 p-2 rounded-lg"
        onPress={() => setModalVisible(true)}
        style={styles.btn}
      >
        <Text style={styles.text}>Transação rápida</Text>
        <Plus size={30} color={colors.icon} />
      </TouchableOpacity>

      {/* Modal para Transação Rápida */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} className="w-[90%]">
            <View className="p-5 rounded-2xl gap-4" style={styles.card}>
              <Text className="text-xl font-bold" style={styles.text}>
                Transação Rápida
              </Text>

              <InputField
                label="Valor:"
                placeholder="0,00"
                keyboardType="numeric"
                leftElement={<Text className="text-gray-500">R$</Text>}
              />

              {/* Data */}
              {/* <DateField /> */}

              {/* Botões */}
              <View className="flex-row items-center justify-end gap-3 mt-3">
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false)
                  }}
                >
                  <Text style={styles.text}>Sair</Text>
                </TouchableOpacity>

                <TouchableOpacity className="px-4 py-2 rounded-lg bg-accent">
                  <Text style={styles.text}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

import { DateField } from "@/src/components/date-field"
import { InputField } from "@/src/components/input-field"
import TransactionTable from "@/src/components/transaction-table"
import { months } from "@/src/constants/months"
import { useAuth } from "@/src/hooks/use-auth"
import { useDashboard } from "@/src/hooks/use-dashboard"
import { useTheme } from "@/src/hooks/use-theme"
import { api } from "@/src/services/api"
import { Category } from "@/src/types/category/types"
import { LineGraphData, PieGraphData } from "@/src/types/dashboard/types"
import { Transaction } from "@/src/types/transaction/types"
import { formatCurrency } from "@/src/utils/format-currency"
import { formatDateToMonthYear } from "@/src/utils/format-date-to-month-year"
import { parseCurrencyToCents } from "@/src/utils/parse-currency-to-cents"
import { roundUp } from "@/src/utils/round-up"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Link, useFocusEffect } from "expo-router"
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChevronRight,
  Landmark,
  Plus,
} from "lucide-react-native"
import { JSX, useCallback, useEffect, useMemo, useState } from "react"
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { LineChart, PieChart } from "react-native-gifted-charts"

type DashboardItemId = "category" | "monthly" | "recent"

type TotalBalance = {
  label: string
  value: number
  frontColor: string
}

type Expense = {
  id: string
  value: string
  date: Date
  type: boolean
  category: string
  desc: string
}

type ApiExpense = {
  id: number
  name: string
  total: number
  color: string
}

const transactions = [
  { key: "receita", label: "Receita" },
  { key: "despesa", label: "Despesa" },
]

export default function Index() {
  const { user, isAuthenticated } = useAuth()
  const { dashboardItems } = useDashboard()
  // Transação Rápida
  const [simpleExpenseType, setSimpleExpenseType] = useState("despesa")
  const [simpleExpenseValue, setSimpleExpenseValue] = useState("")
  const [simpleExpenseDate, setSimpleExpenseDate] = useState<Date | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  // Entry vs Out
  const [totalEntry, setTotalEntry] = useState<LineGraphData[]>([])
  const [totalOut, setTotalOut] = useState<LineGraphData[]>([])
  const [maxTotalEntryOut, setMaxTotalEntryOut] = useState(0)
  // Balance
  const [totalBalance, setTotalBalance] = useState<TotalBalance[]>([])
  const [maxBalanceValue, setMaxBalanceValue] = useState(0)
  // PieGraph
  const [pieData, setPieData] = useState<PieGraphData[]>([])
  // Expenses
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])

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
        btnConfirm: {
          backgroundColor: colors.btnConfirm,
        },
      }),
    [colors],
  )

  const dashboardComponents: Record<DashboardItemId, () => JSX.Element> = {
    category: () => (
      <>
        <Text className="text-2xl font-bold" style={styles.text}>
          Gastos por Categoria (Mês)
        </Text>
        <View
          className="flex-row rounded-lg items-center justify-around p-5 mt-2"
          style={styles.card}
        >
          <View>
            <PieChart
              radius={100}
              data={relativeDataPercent}
              labelsPosition="outward"
              showText
              textColor={colors.text}
              textSize={12}
              strokeWidth={1}
              strokeColor="#333"
            />
          </View>
          {/* Lista de Categorias */}
          <View className="gap-2">
            {pieData.map((item, index) => (
              <View
                key={index}
                className="flex-row gap-2"
                style={{ marginBottom: 5 }}
              >
                <View
                  className="h-5 w-5 rounded-md"
                  style={{ backgroundColor: item.color }}
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
        <Text className="text-2xl font-bold" style={styles.text}>
          Evolução Mensal (2026)
        </Text>
        <View
          className="items-center rounded-lg p-5 mt-2 gap-5"
          style={styles.card}
        >
          <View className="flex-1 flex-row justify-center gap-5">
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
            data={totalEntry}
            data2={totalOut}
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
            // stepValue={500}
            maxValue={maxTotalEntryOut}
            endSpacing={5}
            yAxisColor={colors.text}
            yAxisTextStyle={{ color: colors.text, fontSize: 10 }}
            yAxisLabelWidth={45}
            yAxisLabelPrefix="R$ "
          />
        </View>
      </>
    ),

    recent: () => (
      <>
        <Text className="text-2xl font-bold" style={styles.text}>
          Últimas Movimentações (Mês)
        </Text>
        <TransactionTable data={normalizedData} />
      </>
    ),
  }

  const total = pieData.reduce((acc, item) => acc + item.value, 0)

  const relativeDataPercent = pieData.map((item) => ({
    ...item,
    value: (item.value / total) * 100,
    text: ((item.value / total) * 100).toFixed(2) + "%",
  }))

  const isDisabled = !simpleExpenseDate || !simpleExpenseValue

  async function handleSave() {
    try {
      const token = await AsyncStorage.getItem("@token")

      if (!token) return

      const parsedAmount = parseCurrencyToCents(simpleExpenseValue)

      const payload = {
        value: parsedAmount,
        date: simpleExpenseDate!.toISOString(),
        type: simpleExpenseType === "receita",
      }

      await api.post("/expenses/", payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      setSimpleExpenseDate(null)
      setSimpleExpenseValue("")
      setModalVisible(false)
    } catch (err) {
      console.log("Erro ao salvar Transação rápida:", err)
    }
  }

  // GET categories
  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated || !user?.id) return

      async function getCategories() {
        try {
          const token = await AsyncStorage.getItem("@token")

          if (!token) return

          const response = await api.get("/categories/", {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })

          setCategories(response.data)
        } catch (error) {
          console.error("Erro ao buscar categorias:", error)
        }
      }

      getCategories()
    }, [isAuthenticated, user]),
  )

  // POST Gasto total despesa/receita no ano atual
  useEffect(() => {
    async function getTotalEntradaSaida() {
      try {
        const token = await AsyncStorage.getItem("@token")

        if (!token) return

        const currentYear = new Date().getFullYear()
        const payload = {
          start_month: 0,
          end_month: 11,
          year: currentYear,
        }
        const response = await api.post("/computed/monthlyBalances", payload, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        const lineDataEntry: LineGraphData[] = response.data.map(
          (item: any) => ({
            value: Number(item.total_entry) / 100,
            label: months[item.month],
          }),
        )

        const lineDataOut: LineGraphData[] = response.data.map((item: any) => ({
          value: Number(item.total_out) / 100,
          label: months[item.month],
        }))

        const maxGraphValue = Math.max(
          ...lineDataEntry.map((item) => item.value),
          ...lineDataOut.map((item) => item.value),
        )
        const roundedMaxGraph = roundUp(maxGraphValue, 100)

        setMaxTotalEntryOut(roundedMaxGraph)

        setTotalEntry(lineDataEntry)
        setTotalOut(lineDataOut)
      } catch (err) {
        console.log("Erro ao buscar total despesas/receitas no ano:", err)
      }
    }

    getTotalEntradaSaida()
  }, [user])

  // GET Entrada vs Saída
  useEffect(() => {
    async function getTotalBalance() {
      try {
        const token = await AsyncStorage.getItem("@token")

        if (!token) return

        const currentYear = new Date().getFullYear()
        const response = await api.get(
          `/computed/balance?year=${currentYear}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        )

        const formatted = [
          {
            label: "Receitas",
            value: Number(response.data.receitas) / 100,
            frontColor: "#f00",
          },
          {
            label: "Despesas",
            value: Number(response.data.despesas) / 100,
            frontColor: "#ff0",
          },
        ]

        const maxValue = Math.max(...formatted.map((item: any) => item.value))
        const roundedMax = roundUp(maxValue, 100)

        setMaxBalanceValue(roundedMax)
        setTotalBalance(formatted)
      } catch (err) {
        console.log("Erro ao buscar total despesas/receitas:", err)
      }
    }

    getTotalBalance()
  }, [user])

  // GET expenses
  useFocusEffect(
    useCallback(() => {
      async function getExpenses() {
        try {
          const token = await AsyncStorage.getItem("@token")
          if (!token || !user?.id) return

          const response = await api.get("/expenses/lasts?quantity=5", {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })

          const formattedExpenses = response.data.map((item: any) => ({
            id: item.id,
            value: Number(item.value) / 100,
            date: new Date(item.date),
            type: !!item.type,
            category: item.category_id,
            desc: item.description,
          }))

          setExpenses(formattedExpenses)
        } catch (error) {
          console.error("Erro ao buscar expenses:", error)
        }
      }

      getExpenses()
    }, [user]),
  )

  // GET gasto por categoria no mês atual
  useEffect(() => {
    async function getTotCategories() {
      try {
        const token = await AsyncStorage.getItem("@token")

        if (!token || !user?.id) return

        const response = await api.get(
          `/computed/monthlyTotalCategories?start=${5}&end=${6}&year=${2026}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        )

        const data: ApiExpense[] = response.data

        const dataGraph: PieGraphData[] = data
          .sort((a, b) => b.total - a.total)
          .map((item) => ({
            value: Number(item.total) / 100,
            color: item.color,
            text: item.name,
          }))
        setPieData(dataGraph)
      } catch (err) {
        console.log("Erro ao buscar total por categoria no mês:", err)
      }
    }

    getTotCategories()
  }, [user])

  const normalizedData: Transaction[] = useMemo(() => {
    if (!expenses.length || !categories.length) return []

    return expenses.map((exp) => {
      const category = categories.find((cat) => cat.id === exp.category)

      return {
        id: exp.id,
        date: formatDateToMonthYear(exp.date),
        category: category?.name ?? "Sem categoria",
        description: exp.desc,
        value: Number(exp.value),
        type: exp.type ? "receita" : "despesa",
      }
    })
  }, [expenses, categories])

  return (
    <>
      <ScrollView className="flex-1">
        <View
          className="flex-1 justify-center p-2 gap-3"
          style={styles.container}
        >
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
                  {formatCurrency(
                    totalBalance[0]?.value - totalBalance[1]?.value,
                  )}
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
              {/* Receitas */}
              <View className="flex-row gap-3">
                <BanknoteArrowUp size={30} color={"#8EB69B"} />
                <View>
                  <Text className="font-bold text-sm" style={styles.text}>
                    Total Receitas
                  </Text>
                  <Text style={styles.text}>
                    {formatCurrency(totalBalance[0]?.value)}
                  </Text>
                </View>
              </View>
              {/* Despesas */}
              <View className="flex-row gap-3">
                <BanknoteArrowDown size={30} color={"#DB5461"} />
                <View>
                  <Text className="font-bold text-sm" style={styles.text}>
                    Total Despesas
                  </Text>
                  <Text style={styles.text}>
                    {formatCurrency(totalBalance[1]?.value)}
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
            {/* Transação Rápida */}
            <View className="p-5 rounded-2xl gap-4" style={styles.card}>
              <Text className="text-xl font-bold" style={styles.text}>
                Transação Rápida
              </Text>

              {/* Campo tipo */}
              <View className="flex-row items-center gap-2">
                <Text style={styles.text}>Tipo de Transação:</Text>

                <View className="flex-1 flex-row gap-2">
                  {transactions.map((transaction) => (
                    <TouchableOpacity
                      key={transaction.key}
                      onPress={() =>
                        setSimpleExpenseType(transaction.key as any)
                      }
                      className="flex-1 flex-row items-center justify-center p-2 rounded-lg"
                      style={
                        simpleExpenseType === transaction.key ? styles.btn : ""
                      }
                    >
                      <Text style={styles.text}>{transaction.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Campo valor */}
              <InputField
                label="Valor:"
                placeholder="0,00"
                keyboardType="numeric"
                leftElement={<Text className="text-gray-500">R$</Text>}
                value={simpleExpenseValue}
                onChangeText={(text) => setSimpleExpenseValue(text)}
              />

              {/* Campo Data */}
              <DateField
                value={simpleExpenseDate}
                onChange={(date) => setSimpleExpenseDate(date)}
              />

              {/* Botões */}
              <View className="flex-row items-center justify-end gap-3 mt-3">
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false)
                  }}
                >
                  <Text style={styles.text}>Sair</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`px-4 py-2 rounded-lg ${isDisabled ? "bg-gray-400" : ""}`}
                  disabled={isDisabled}
                  onPress={handleSave}
                  style={isDisabled ? "" : styles.btnConfirm}
                >
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

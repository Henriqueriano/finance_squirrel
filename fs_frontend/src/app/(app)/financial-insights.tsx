import { months } from "@/src/constants/months"
import { useAuth } from "@/src/hooks/use-auth"
import { useTheme } from "@/src/hooks/use-theme"
import { api } from "@/src/services/api"
import { LineGraphData } from "@/src/types/dashboard/types"
import { formatCurrency } from "@/src/utils/format-currency"
import { roundUp } from "@/src/utils/round-up"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Redirect } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { BarChart, LineChart } from "react-native-gifted-charts"

type TotalCategory = {
  id: string
  label: string
  value: number
  frontColor: string
}

type TotalBalance = {
  label: string
  value: number
  frontColor: string
}

type MonthlyCompare = {
  month: number
  year: number
  total_entry: number
  total_out: number
}

export default function FinancialInsights() {
  const { user, isAuthenticated } = useAuth()
  // Category
  const [totalCategories, setTotalCategories] = useState<TotalCategory[]>([])
  const [maxCategoriesValue, setMaxCategoriesValue] = useState(0)
  // Balance
  const [totalBalance, setTotalBalance] = useState<TotalBalance[]>([])
  const [maxBalanceValue, setMaxBalanceValue] = useState(0)
  // Entry vs Out
  const [totalEntry, setTotalEntry] = useState<LineGraphData[]>([])
  const [totalOut, setTotalOut] = useState<LineGraphData[]>([])
  const [maxTotalEntryOut, setMaxTotalEntryOut] = useState(0)
  // DateOne vs DateTwo
  const [selectedDateOne, setSelectedDateOne] = useState<Date | null>(null)
  const [selectedDateTwo, setSelectedDateTwo] = useState<Date | null>(null)
  const [activeField, setActiveField] = useState<"dateOne" | "dateTwo" | null>(
    null,
  )
  const [show, setShow] = useState(false)
  const [monthlyCompare, setMonthlyCompare] = useState<MonthlyCompare[]>([])

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
      }),
    [colors],
  )

  function handleChange(event: any, selectedDate?: Date) {
    setShow(false)

    if (!selectedDate || !activeField) return

    if (activeField === "dateOne") {
      setSelectedDateOne(selectedDate)
    } else if (activeField === "dateTwo") {
      setSelectedDateTwo(selectedDate)
    }
  }

  function formatMonthYear(date: Date | null) {
    if (!date) return ""
    return date.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    })
  }

  // Gastos total por Categoria
  useEffect(() => {
    async function getTotalCategories() {
      try {
        const token = await AsyncStorage.getItem("@token")

        if (!token) return

        const response = await api.get("/computed/categorical", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        const formatted = response.data.map((item: any) => ({
          id: item.id,
          label: item.name,
          value: Number(item.value) / 100,
          frontColor: item.color,
        }))
        const maxValue = Math.max(...formatted.map((item: any) => item.value))
        const roundedMax = roundUp(maxValue, 100)

        setMaxCategoriesValue(roundedMax)
        setTotalCategories(formatted)
      } catch (err) {
        console.log("Erro ao buscar total categorias:", err)
      }
    }

    getTotalCategories()
  }, [user])

  // Entrada vs Saída
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

  // Gasto total despesa/receita no ano atual
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

  // Comparar Meses
  useEffect(() => {
    async function handleCompareMonths() {
      try {
        if (!selectedDateOne || !selectedDateTwo) return

        const token = await AsyncStorage.getItem("@token")

        if (!token) return

        const payload = {
          month_one: selectedDateOne.getMonth(),
          year_one: selectedDateOne.getFullYear(),

          month_two: selectedDateTwo.getMonth(),
          year_two: selectedDateTwo.getFullYear(),
        }

        const response = await api.post(
          "/computed/monthlyBalancesCompare",
          payload,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        )

        const formatted = response.data.map((item: MonthlyCompare) => ({
          month: item.month,
          year: item.year,
          total_entry: Number(item.total_entry) / 100,
          total_out: Number(item.total_out) / 100,
        }))

        setMonthlyCompare(formatted)
      } catch (error) {
        console.log("Erro ao comparar meses:", error)
      }
    }
    handleCompareMonths()
  }, [selectedDateOne, selectedDateTwo])

  if (!isAuthenticated) {
    return <Redirect href="/signin" />
  }

  return (
    <ScrollView>
      <View className="flex-1 p-2 gap-4" style={styles.container}>
        {/* Gasto por categoria (Total) */}
        <View className="flex-1 mt-2">
          <Text className="text-2xl font-bold mb-2" style={styles.text}>
            Gastos por Categorias (Total)
          </Text>
          <View className="rounded-lg p-5" style={styles.card}>
            <BarChart
              data={totalCategories}
              disablePress
              backgroundColor={"rgb(0 0 0 / 0.7)"}
              // 📏 Dimensão
              width={280}
              // 🎯 Estilo das barras
              barBorderTopLeftRadius={5}
              barBorderTopRightRadius={5}
              // 📊 Eixo X (valores)
              xAxisLabelTextStyle={{
                color: colors.text,
                fontSize: 10,
              }}
              xAxisThickness={1}
              xAxisColor={colors.text}
              spacing={50}
              initialSpacing={40}
              endSpacing={5}
              // 📊 Eixo Y (labels)
              yAxisLabelWidth={40}
              yAxisTextStyle={{ color: colors.text, fontSize: 10 }}
              yAxisThickness={1}
              yAxisColor={colors.text}
              noOfSections={5}
              // stepValue={200}
              maxValue={maxCategoriesValue}
              yAxisLabelPrefix="R$"
              // 🔢 Valores nas barras
              // showValuesAsTopLabel
              // topLabelTextStyle={{ color: "#fff", fontSize: 10 }}
              // 🧼 Grid
              rulesColor={colors.text}
            />
          </View>
        </View>

        {/* Evolução Mensal (ano) */}
        <View className="flex-1">
          <Text className="text-2xl font-bold mb-2" style={styles.text}>
            Evolução Mensal (2026)
          </Text>
          <View className="rounded-lg p-5" style={styles.card}>
            <View className="flex-1 flex-row justify-center mb-5 gap-5">
              <View className="flex-row gap-2">
                <View className="h-5 w-5 bg-sky-300"></View>
                <Text style={styles.text}>Receita</Text>
              </View>
              <View className="flex-row gap-2">
                <View className="h-5 w-5 bg-orange-400"></View>
                <Text style={styles.text}>Despesa</Text>
              </View>
            </View>

            <LineChart
              data={totalEntry}
              data2={totalOut}
              width={280}
              backgroundColor={"rgb(0 0 0 / 0.7)"}
              color1="skyblue"
              color2="orange"
              dataPointsHeight={6}
              dataPointsWidth={6}
              dataPointsColor1="blue"
              dataPointsColor2="red"
              endSpacing={5}
              textFontSize={12}
              // X axis
              xAxisColor={colors.text}
              xAxisLabelTextStyle={{ color: colors.text, fontSize: 12 }}
              // Y axis
              noOfSections={5}
              // stepValue={500}
              maxValue={maxTotalEntryOut}
              yAxisLabelWidth={40}
              yAxisColor={colors.text}
              yAxisTextStyle={{ color: colors.text, fontSize: 10 }}
              yAxisLabelPrefix="R$"
            />
          </View>
        </View>

        {/* Entrada vs saída (mês) */}
        <View className="flex-1">
          <Text className="text-2xl font-bold mb-2" style={styles.text}>
            Entradas vs Saídas (Mês)
          </Text>
          <View className="rounded-lg p-5 items-center" style={styles.card}>
            <BarChart
              data={totalBalance}
              width={280}
              backgroundColor={"rgb(0 0 0 / 0.7)"}
              barBorderTopLeftRadius={5}
              barBorderTopRightRadius={5}
              initialSpacing={60}
              spacing={100}
              endSpacing={5}
              xAxisLabelTextStyle={{
                color: colors.text,
                fontSize: 10,
              }}
              xAxisColor={colors.text}
              // Y axis
              noOfSections={5}
              maxValue={maxBalanceValue}
              yAxisTextStyle={{ color: colors.text, fontSize: 10 }}
              yAxisColor={colors.text}
              yAxisLabelPrefix="R$"
              yAxisLabelWidth={40}
              rulesColor={colors.text}
            />
          </View>
        </View>

        {/* Comparação entre meses */}
        <View className="flex-1">
          <Text className="text-2xl font-bold mb-2" style={styles.text}>
            Comparação entre meses
          </Text>

          <View className="rounded-lg p-5 gap-5" style={styles.card}>
            {/* Inputs p/ selecionar os meses */}
            <View className="flex-1 flex-row justify-between">
              <TouchableOpacity
                className="p-3 bg-black/70 justify-between rounded-lg"
                onPress={() => {
                  setActiveField("dateOne")
                  setShow(true)
                }}
              >
                <Text style={styles.text}>
                  {selectedDateOne
                    ? formatMonthYear(selectedDateOne)
                    : "Escolha Mês 1"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 bg-black/70 justify-between rounded-lg"
                onPress={() => {
                  setActiveField("dateTwo")
                  setShow(true)
                }}
              >
                <Text style={styles.text}>
                  {selectedDateTwo
                    ? formatMonthYear(selectedDateTwo)
                    : "Escolha Mês 2"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Comparação */}
            <View className="flex-1 gap-5">
              {/* Receita */}
              <View className="flex-1 gap-2">
                <View className="flex-row items-center gap-2">
                  <View className="h-5 w-5 bg-[#00BF62] rounded-full"></View>
                  <Text style={styles.text}>Receita</Text>
                </View>

                <View className="flex-1 flex-row justify-between items-center">
                  <View className="bg-black/70 border-l-8 border-l-[#00BF62] rounded-r-2xl p-4">
                    <Text className="text-sm" style={styles.text}>
                      {monthlyCompare[0]
                        ? formatMonthYear(
                            new Date(
                              monthlyCompare[0].year,
                              monthlyCompare[0].month,
                            ),
                          )
                        : "--"}
                    </Text>
                    <Text className="text-2xl font-bold" style={styles.text}>
                      {formatCurrency(monthlyCompare[0]?.total_entry ?? 0)}
                    </Text>
                  </View>

                  <Text
                    className="h-10 w-10 bg-black/70 p-2 text-center rounded-lg"
                    style={styles.text}
                  >
                    vs
                  </Text>

                  <View className="bg-black/70 border-l-8 border-l-[#00BF62] rounded-r-2xl p-4">
                    <Text className="text-sm" style={styles.text}>
                      {monthlyCompare[1]
                        ? formatMonthYear(
                            new Date(
                              monthlyCompare[1].year,
                              monthlyCompare[1].month,
                            ),
                          )
                        : "--"}
                    </Text>
                    <Text className="text-2xl font-bold" style={styles.text}>
                      {formatCurrency(monthlyCompare[1]?.total_entry ?? 0)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-1 h-1 bg-black/70 rounded-lg"></View>

              {/* Despesa */}
              <View className="flex-1 gap-2">
                <View className="flex-row items-center gap-2">
                  <View className="h-5 w-5 bg-[#FF5757] rounded-full"></View>
                  <Text style={styles.text}>Despesa</Text>
                </View>

                <View className="flex-1 flex-row justify-between items-center">
                  <View className="bg-black/70 border-l-8 border-l-[#FF5757] rounded-r-2xl p-4">
                    <Text className="text-sm" style={styles.text}>
                      {monthlyCompare[0]
                        ? formatMonthYear(
                            new Date(
                              monthlyCompare[0].year,
                              monthlyCompare[0].month,
                            ),
                          )
                        : "--"}
                    </Text>
                    <Text className="text-2xl font-bold" style={styles.text}>
                      {formatCurrency(monthlyCompare[0]?.total_out ?? 0)}
                    </Text>
                  </View>

                  <Text
                    className="h-10 w-10 bg-black/70 p-2 text-center rounded-lg"
                    style={styles.text}
                  >
                    vs
                  </Text>

                  <View className="bg-black/70 border-l-8 border-l-[#FF5757] rounded-r-2xl p-4">
                    <Text className="text-sm" style={styles.text}>
                      {monthlyCompare[1]
                        ? formatMonthYear(
                            new Date(
                              monthlyCompare[0].year,
                              monthlyCompare[0].month,
                            ),
                          )
                        : "--"}
                    </Text>
                    <Text className="text-2xl font-bold" style={styles.text}>
                      {formatCurrency(monthlyCompare[1]?.total_out ?? 0)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-1 h-1 bg-black/70 rounded-lg"></View>

              {/* Saldo */}
              {/* <View className="flex-1 gap-2">
                <View className="flex-row items-center gap-2">
                  <View className="h-5 w-5 bg-[#536FFF] rounded-full"></View>
                  <Text style={styles.text}>Saldo</Text>
                </View>

                <View className="flex-1 flex-row justify-between items-center">
                  <View className="bg-black/70 border-l-8 border-l-[#536FFF] rounded-r-2xl p-4">
                    <Text className="text-sm" style={styles.text}>
                      Set/2025
                    </Text>
                    <Text className="text-2xl font-bold" style={styles.text}>
                      R$ 300,00
                    </Text>
                  </View>

                  <Text
                    className="h-10 w-10 bg-black/70 p-2 text-center rounded-lg"
                    style={styles.text}
                  >
                    vs
                  </Text>

                  <View className="bg-black/70 border-l-8 border-l-[#536FFF] rounded-r-2xl p-4">
                    <Text className="text-sm" style={styles.text}>
                      Set/2025
                    </Text>
                    <Text className="text-2xl font-bold" style={styles.text}>
                      R$ 300,00
                    </Text>
                  </View>
                </View>
              </View> */}
            </View>
          </View>
        </View>
      </View>

      {show && (
        <DateTimePicker
          value={
            activeField === "dateOne"
              ? selectedDateOne || new Date()
              : selectedDateTwo || new Date()
          }
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </ScrollView>
  )
}

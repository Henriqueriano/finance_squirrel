import { useAuth } from "@/src/hooks/use-auth"
import { useTheme } from "@/src/hooks/use-theme"
import { api } from "@/src/services/api"
import { LineGraphData } from "@/src/types/dashboard/types"
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

export default function FinancialInsights() {
  const { user, isAuthenticated } = useAuth()
  // Category
  const [totalCategories, setTotalCategories] = useState<TotalCategory[]>([])
  const [maxCategoriesValue, setMaxCategoriesValue] = useState(0)
  // Balance
  const [totalBalance, setTotalBalance] = useState<TotalBalance[]>([])
  const [maxBalanceValue, setMaxBalanceValue] = useState(0)

  const [date1, setDate1] = useState<Date | null>(null)
  const [date2, setDate2] = useState<Date | null>(null)
  const [activeField, setActiveField] = useState<"date1" | "date2" | null>(null)
  const [show, setShow] = useState(false)

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

    if (activeField === "date1") {
      setDate1(selectedDate)
    } else if (activeField === "date2") {
      setDate2(selectedDate)
    }
  }

  function formatMonthYear(date: Date | null) {
    if (!date) return ""
    return date.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    })
  }

  // Gastos por Categoria
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

        const response = await api.get("/computed/balance", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

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
              data={lineData1}
              data2={lineData2}
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
              stepValue={500}
              maxValue={2500}
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
                  setActiveField("date1")
                  setShow(true)
                }}
              >
                <Text style={styles.text}>
                  {date1 ? formatMonthYear(date1) : "Escolha Mês 1"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 bg-black/70 justify-between rounded-lg"
                onPress={() => {
                  setActiveField("date2")
                  setShow(true)
                }}
              >
                <Text style={styles.text}>
                  {date2 ? formatMonthYear(date2) : "Escolha Mês 2"}
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

                  <View className="bg-black/70 border-l-8 border-l-[#00BF62] rounded-r-2xl p-4">
                    <Text className="text-sm" style={styles.text}>
                      Set/2025
                    </Text>
                    <Text className="text-2xl font-bold" style={styles.text}>
                      R$ 300,00
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

                  <View className="bg-black/70 border-l-8 border-l-[#FF5757] rounded-r-2xl p-4">
                    <Text className="text-sm" style={styles.text}>
                      Set/2025
                    </Text>
                    <Text className="text-2xl font-bold" style={styles.text}>
                      R$ 300,00
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-1 h-1 bg-black/70 rounded-lg"></View>

              {/* Saldo */}
              <View className="flex-1 gap-2">
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
              </View>
            </View>
          </View>
        </View>
      </View>

      {show && (
        <DateTimePicker
          value={
            activeField === "date1" ? date1 || new Date() : date2 || new Date()
          }
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </ScrollView>
  )
}

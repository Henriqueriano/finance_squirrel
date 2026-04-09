import { LineGraphData } from "@/src/types/dashboard/types"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useState } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { BarChart, LineChart } from "react-native-gifted-charts"

const categories = [
  { id: "1", value: 850.0, frontColor: "#fb923c", label: "Moradia" },
  { id: "2", value: 100.0, frontColor: "#c084fc", label: "Alimentação" },
  { id: "3", value: 200.0, frontColor: "#818cf8", label: "Lazer" },
  { id: "4", value: 200.0, frontColor: "#38bdf8", label: "Transporte" },
  { id: "5", value: 300.0, frontColor: "#22c55e", label: "Investimentos" },
  { id: "6", value: 600.0, frontColor: "#f87171", label: "Mercado" },
  { id: "7", value: 500.0, frontColor: "#f87171", label: "Shopping" },
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

const data = [
  { label: "Receita", value: 5920.5, frontColor: "#f00" },
  { label: "Despesa", value: 3789.95, frontColor: "#0ff" },
]

export default function FinancialInsights() {
  const [date1, setDate1] = useState<Date | null>(null)
  const [date2, setDate2] = useState<Date | null>(null)
  const [activeField, setActiveField] = useState<"date1" | "date2" | null>(null)
  const [show, setShow] = useState(false)

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

  return (
    <ScrollView>
      <View className="flex-1 bg-background p-5 gap-8">
        {/* Gasto por categoria (Total) */}
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold mb-2">
            Gastos por Categorias (Total)
          </Text>
          <View className="bg-card rounded-lg p-5">
            <BarChart
              data={categories}
              disablePress
              // 📏 Dimensão
              width={250}
              // 🎯 Estilo das barras
              barBorderTopLeftRadius={5}
              barBorderTopRightRadius={5}
              // 📊 Eixo X (valores)
              xAxisLabelTextStyle={{
                color: "#fff",
                fontSize: 10,
              }}
              xAxisThickness={1}
              xAxisColor="#fff"
              spacing={50}
              initialSpacing={40}
              endSpacing={10}
              // 📊 Eixo Y (labels)
              yAxisTextStyle={{ color: "#fff", fontSize: 10 }}
              yAxisThickness={1}
              yAxisColor="#fff"
              noOfSections={5}
              stepValue={200}
              maxValue={1000}
              yAxisLabelPrefix="R$"
              // 🔢 Valores nas barras
              // showValuesAsTopLabel
              // topLabelTextStyle={{ color: "#fff", fontSize: 10 }}
              // 🧼 Grid
              rulesColor="#fff"
            />
          </View>
        </View>

        {/* Evolução Mensal (ano) */}
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold mb-2">
            Evolução Mensal (2026)
          </Text>
          <View className="bg-card rounded-lg p-5">
            <View className="flex-1 flex-row justify-center mb-5 gap-5">
              <View className="flex-row gap-2">
                <View className="h-5 w-5 bg-sky-300"></View>
                <Text className="text-white">Receita</Text>
              </View>
              <View className="flex-row gap-2">
                <View className="h-5 w-5 bg-orange-400"></View>
                <Text className="text-white">Despesa</Text>
              </View>
            </View>

            <LineChart
              data={lineData1}
              data2={lineData2}
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
        </View>

        {/* Entrada vc saída (mês) */}
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold mb-2">
            Entradas vs Saídas (Mês)
          </Text>
          <View className="bg-card rounded-lg p-5 items-center">
            <BarChart
              width={200}
              data={data}
              spacing={60}
              initialSpacing={50}
              endSpacing={10}
              barBorderTopLeftRadius={5}
              barBorderTopRightRadius={5}
              noOfSections={5}
              maxValue={6000}
              xAxisLabelTextStyle={{
                color: "#fff",
                fontSize: 10,
              }}
              xAxisColor="#fff"
              yAxisTextStyle={{ color: "#fff", fontSize: 10 }}
              yAxisColor="#fff"
              rulesColor="#fff"
              yAxisLabelPrefix="R$"
              yAxisLabelContainerStyle={{ width: 50 }}
            />
          </View>
        </View>

        {/* Comparação entre meses */}
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold mb-2">
            Comparação entre meses
          </Text>

          <View className="bg-card rounded-lg p-5 gap-5">
            {/* Inputs p/ selecionar os meses */}
            <View className="flex-1 flex-row justify-between">
              <TouchableOpacity
                className="p-3 bg-black/70 justify-between rounded-lg"
                onPress={() => {
                  setActiveField("date1")
                  setShow(true)
                }}
              >
                <Text className="text-white">
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
                <Text className="text-white">
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
                  <Text className="text-white">Receita</Text>
                </View>

                <View className="flex-1 flex-row justify-between items-center">
                  <View className="bg-black/70 border-l-8 border-l-[#00BF62] rounded-r-2xl p-4">
                    <Text className="text-white text-sm">Set/2025</Text>
                    <Text className="text-white text-2xl font-bold">
                      R$ 300,00
                    </Text>
                  </View>

                  <Text className="h-10 w-10 bg-black/70 text-white p-2 text-center rounded-lg">
                    vs
                  </Text>

                  <View className="bg-black/70 border-l-8 border-l-[#00BF62] rounded-r-2xl p-4">
                    <Text className="text-white text-sm">Set/2025</Text>
                    <Text className="text-white text-2xl font-bold">
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
                  <Text className="text-white">Despesa</Text>
                </View>

                <View className="flex-1 flex-row justify-between items-center">
                  <View className="bg-black/70 border-l-8 border-l-[#FF5757] rounded-r-2xl p-4">
                    <Text className="text-white text-sm">Set/2025</Text>
                    <Text className="text-white text-2xl font-bold">
                      R$ 300,00
                    </Text>
                  </View>

                  <Text className="h-10 w-10 bg-black/70 text-white p-2 text-center rounded-lg">
                    vs
                  </Text>

                  <View className="bg-black/70 border-l-8 border-l-[#FF5757] rounded-r-2xl p-4">
                    <Text className="text-white text-sm">Set/2025</Text>
                    <Text className="text-white text-2xl font-bold">
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
                  <Text className="text-white">Saldo</Text>
                </View>

                <View className="flex-1 flex-row justify-between items-center">
                  <View className="bg-black/70 border-l-8 border-l-[#536FFF] rounded-r-2xl p-4">
                    <Text className="text-white text-sm">Set/2025</Text>
                    <Text className="text-white text-2xl font-bold">
                      R$ 300,00
                    </Text>
                  </View>

                  <Text className="h-10 w-10 bg-black/70 text-white p-2 text-center rounded-lg">
                    vs
                  </Text>

                  <View className="bg-black/70 border-l-8 border-l-[#536FFF] rounded-r-2xl p-4">
                    <Text className="text-white text-sm">Set/2025</Text>
                    <Text className="text-white text-2xl font-bold">
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

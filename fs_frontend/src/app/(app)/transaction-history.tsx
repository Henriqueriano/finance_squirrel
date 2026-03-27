import { formatCurrency } from "@/src/utils/format-currency"
import { parseDate } from "@/src/utils/parse-date"
import { useMemo, useState } from "react"

import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native"

type listItem = {
  id: string
  date: string
  categorie: string
  description: string
  value: number
  type: string
}

export default function TransactionHistoryScreen() {
  const [ordenarPor, setOrdenarPor] = useState<"data" | "valor">("data")

  const data = [
    { id: "1", date: "Jun/2026", categorie: "Alimentação", description: "...", value: 10, type: "Despesa" },
    { id: "2", date: "Dez/2025", categorie: "Jogos", description: "Minecraft", value: 109.90, type: "Despesa" },
    { id: "3", date: "Jan/2026", categorie: "Alimentação", description: "Arroz, Feijão", value: 17.90, type: "Despesa" },
    { id: "4", date: "Abr/2025", categorie: "Alimentação", description: "Macarrão, Leite", value: 9.50, type: "Despesa" },
  ]

  const sortedData = useMemo(() => {
      const sorted = [...data]

      if (ordenarPor === "data") {
        sorted.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
      }

      if (ordenarPor === "valor") {
        sorted.sort((a, b) => b.value - a.value)
      }

      return sorted
    }, [ordenarPor, data])

  const TableHeader = () => (
    <View className="flex-row border-b border-gray-600 pb-1">
      <Text className="flex-1 text-green-200 font-bold text-xs">Data</Text>
      <Text className="flex-1 text-green-200 font-bold text-xs">Categoria</Text>
      <Text className="flex-1 text-green-200 font-bold text-xs">Descrição</Text>
      <Text className="flex-1 text-green-200 font-bold text-xs">Valor</Text>
      <Text className="flex-1 text-green-200 font-bold text-xs">Tipo</Text>
    </View>
  ) 
  const renderItem = ({ item }: { item: listItem }) => (
    <View className="flex-row py-1 border-b border-gray-800">
      <Text className="flex-1 text-textPrimary text-xs">{item.date}</Text>
      <Text className="flex-1 text-textPrimary text-xs">{item.categorie}</Text>
      <Text className="flex-1 text-textPrimary text-xs" numberOfLines={1}>
        {item.description}
      </Text>
      <Text className="flex-1 text-textPrimary text-xs">
        {formatCurrency(item.value)}
      </Text>
      <Text className="flex-1 text-textPrimary text-xs">{item.type}</Text>
    </View>
  )

  return (
    <View className="flex-1 bg-background p-5 gap-3">
      <Text className="text-textPrimary font-bold text-2xl">
        Histórico Financeiro
      </Text>

      {/* FILTROS */}
      <View className="bg-card p-2 rounded-xl gap-2">
        <Text className="text-textPrimary text-xl font-medium">
          Filtros:
        </Text>
        <View className="flex-row gap-2">
          <View className="flex-1 bg-accent p-2 rounded-lg">
            <Text>Tipo ▼</Text>
          </View>
          <View className="flex-1 bg-accent p-2 rounded-lg">
            <Text>Categoria ▼</Text>
          </View>
          <View className="flex-1 bg-accent p-2 rounded-lg">
            <Text>Data ▼</Text>
          </View>
        </View>
      </View>

      {/* ORDENAÇÃO */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          className={`px-3 py-2 rounded-lg ${
            ordenarPor === "data" ? "bg-accent" : "bg-green-900"
          }`}
          onPress={() => setOrdenarPor("data")}
        >
          <Text className="text-textPrimary">Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-3 py-2 rounded-lg ${
            ordenarPor === "valor" ? "bg-accent" : "bg-green-900"
          }`}
          onPress={() => setOrdenarPor("valor")}
        >
          <Text className="text-textPrimary">Valor</Text>
        </TouchableOpacity>
      </View>

      {/* HEADER DA TABELA */}
      <View className="flex-row mt-2 mb-1">
        <Text className="flex-1 text-green-200 font-bold text-xs">Data</Text>
        <Text className="flex-1 text-green-200 font-bold text-xs">Categoria</Text>
        <Text className="flex-1 text-green-200 font-bold text-xs">Descrição</Text>
        <Text className="flex-1 text-green-200 font-bold text-xs">Valor</Text>
        <Text className="flex-1 text-green-200 font-bold text-xs">Tipo</Text>
      </View>

      {/* LISTA */}
      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={TableHeader}
        stickyHeaderIndices={[0]} // 🔥 header fixo
        contentContainerStyle={{ gap: 6 }}
      />
    </View>
  )
}
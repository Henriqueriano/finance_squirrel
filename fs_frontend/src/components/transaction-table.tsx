import { Text, View } from "react-native"
import { Transaction } from "../types/transaction/types"
import { formatCurrency } from "../utils/format-currency"

type TransactionTableProps = {
  data: Transaction[]
}

const TableHeader = () => (
  <View className="flex-row gap-2 border-b border-gray-600 py-2 bg-background">
    <Text className="flex-1 text-accent font-bold text-xs">Data</Text>
    <Text className="flex-1 text-accent font-bold text-xs">Categoria</Text>
    <Text className="flex-1 text-accent font-bold text-xs">Descrição</Text>
    <Text className="flex-1 text-accent font-bold text-xs">Valor</Text>
    <Text className="flex-1 text-accent font-bold text-xs">Tipo</Text>
  </View>
)
const renderItem = ({ item }: { item: Transaction }) => (
  <View className="flex-row gap-2 py-1 border-b border-gray-800" key={item.id}>
    <Text className="flex-1 text-white text-xs">{item.date}</Text>
    <Text className="flex-1 text-white text-xs">{item.category}</Text>
    <Text className="flex-1 text-white text-xs" numberOfLines={1}>
      {item.description}
    </Text>
    <Text className="flex-1 text-white text-xs">
      {formatCurrency(item.value)}
    </Text>
    <Text className="flex-1 text-white text-xs">{item.type}</Text>
  </View>
)

export default function TransactionTable({ data }: TransactionTableProps) {
  return (
    <View style={{ gap: 6 }}>
      <TableHeader />
      {/* Linhas */}
      {data.map((item) => renderItem({ item }))}
    </View>
  )
}

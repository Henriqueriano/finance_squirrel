import { useMemo } from "react"
import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "../hooks/use-theme"
import { Transaction } from "../types/transaction/types"
import { formatCurrency } from "../utils/format-currency"

type TransactionTableProps = {
  data: Transaction[]
}

const TableHeader = ({ styles }: { styles: any }) => (
  <View className="flex-row gap-2 border-b border-gray-600 py-2">
    <Text className="flex-1 font-bold text-xs" style={styles.accent}>
      Data
    </Text>
    <Text className="flex-1 font-bold text-xs" style={styles.accent}>
      Categoria
    </Text>
    <Text className="flex-1 font-bold text-xs" style={styles.accent}>
      Descrição
    </Text>
    <Text className="flex-1 font-bold text-xs" style={styles.accent}>
      Valor
    </Text>
    <Text className="flex-1 font-bold text-xs" style={styles.accent}>
      Tipo
    </Text>
  </View>
)

const renderItem = ({ item, styles }: { item: Transaction; styles: any }) => (
  <View className="flex-row gap-2 py-1 border-b border-gray-800" key={item.id}>
    <Text className="flex-1 text-xs" style={styles.text}>
      {item.date}
    </Text>
    <Text className="flex-1 text-xs" style={styles.text}>
      {item.category}
    </Text>
    <Text className="flex-1 text-xs" style={styles.text} numberOfLines={1}>
      {item.description}
    </Text>
    <Text className="flex-1 text-xs" style={styles.text}>
      {formatCurrency(item.value)}
    </Text>
    <Text className="flex-1 text-xs" style={styles.text}>
      {item.type}
    </Text>
  </View>
)

export default function TransactionTable({ data }: TransactionTableProps) {
  const { colors } = useTheme()
  const styles = useMemo(
    () =>
      StyleSheet.create({
        background: {
          backgroundColor: colors.background,
        },
        text: {
          color: colors.text,
        },
        accent: {
          color: colors.accent,
        },
      }),
    [colors],
  )

  return (
    <View style={{ gap: 6 }}>
      <TableHeader styles={styles} />
      {/* Linhas */}
      {data.map((item) => renderItem({ item, styles }))}
    </View>
  )
}

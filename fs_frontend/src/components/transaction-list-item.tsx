import { useEffect, useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { Category } from "../types/category/types"
import { DateField } from "./date-field"
import { InputField } from "./input-field"

type TransactionForm = {
  id: string
  type: "despesa" | "receita"
  amount: string
  date: Date | null
  category: Category | null
  description: string
}

interface TransactionListItemProps {
  id: string
  cont: number
  data: TransactionForm
  categories: Category[]
  onChangeCategory: (id: string, category: Category | null) => void
  onChangeDescription: (id: string, description: string) => void
  onChangeType: (id: string, type: "receita" | "despesa") => void
  onChangeAmount: (id: string, amount: string) => void
  onChangeDate: (id: string, date: Date | null) => void
  onRemove: (id: string) => void
  canRemove: boolean
}

const transactions = [
  { key: "receita", label: "Receita" },
  { key: "despesa", label: "Despesa" },
]

export function TransactionListItem({
  cont,
  id,
  data,
  categories,
  canRemove,
  onRemove,
  onChangeCategory,
  onChangeDescription,
  onChangeDate,
  onChangeType,
  onChangeAmount,
}: TransactionListItemProps) {
  const [search, setSearch] = useState(data.category?.label || "")

  const normalizedSearch = search.toLowerCase()

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(normalizedSearch),
  )

  useEffect(() => {
    if (data.category) {
      setSearch(data.category.label)
    }
  }, [data.category])

  return (
    <View className="bg-card rounded-xl p-4">
      {/* HEADER */}
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">Transação {cont}</Text>

        {canRemove && (
          <TouchableOpacity onPress={() => onRemove(id)}>
            <Text className="text-red-500 font-bold">Remover</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FORMULÁRIO */}
      <View className="gap-4 mt-4">
        {/* Tipo */}
        <View className="flex-row items-center gap-2">
          <Text className="text-white">Tipo de Transação:</Text>

          <View className="flex-1 flex-row gap-2">
            {transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.key}
                onPress={() => onChangeType(id, transaction.key as any)}
                className={`flex-1 flex-row items-center justify-center p-2 rounded-lg ${
                  data.type === transaction.key ? "bg-accent" : "bg-transparent"
                }`}
              >
                <Text className="text-white">{transaction.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Valor */}
        <InputField
          label="Valor:"
          placeholder="0,00"
          keyboardType="numeric"
          value={data.amount}
          onChangeText={(text) => onChangeAmount(id, text)}
          leftElement={<Text className="text-gray-500">R$</Text>}
        />

        {/* Data */}
        <DateField
          value={data.date}
          onChange={(date) => onChangeDate(id, date)}
        />

        {/* Categoria */}
        <View className="flex-row items-center gap-3 z-10">
          <Text className="text-white w-24">Categoria:</Text>
          <View className="flex-1 relative">
            <TextInput
              className="flex-1 bg-white rounded-lg px-3 py-2"
              value={search}
              onChangeText={(text) => {
                setSearch(text)
                onChangeCategory(id, null as any)
              }}
              placeholder="Digite a categoria"
            />

            {search.length > 0 && !data.category && (
              <View className="absolute w-full top-10 bg-white rounded-sm border z-20">
                {filteredCategories.length === 0 ? (
                  <Text className="p-2 text-gray-500">
                    Nenhuma categoria encontrada
                  </Text>
                ) : (
                  filteredCategories.map((cat) => (
                    <TouchableOpacity
                      className="p-2 border-b"
                      key={cat.id}
                      onPress={() => {
                        onChangeCategory(id, cat)
                        setSearch(cat.label)
                      }}
                    >
                      <Text>{cat.label}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </View>
        </View>

        {/* Descrição */}
        <View className="gap-2">
          <Text className="text-white">Descrição:</Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-3 h-28"
            multiline
            textAlignVertical="top"
            value={data.description}
            onChangeText={(text) => onChangeDescription(id, text)}
            placeholder="Digite uma descrição..."
            placeholderTextColor="#999"
          />
        </View>
      </View>
    </View>
  )
}

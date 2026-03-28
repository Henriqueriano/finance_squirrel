import { useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { DateField } from "./date-field"
import { InputField } from "./input-field"

interface TransactionListItemProps {
  cont: number
  id: string
  canRemove: boolean
  onRemove: (id: string) => void
}

export function TransactionListItem({
  cont,
  id,
  canRemove,
  onRemove
}: TransactionListItemProps) {
  const [transactionTypeSelected, setTransactionTypeSelected] = useState("receita")

  const transactions = [
    { key: "receita", label: "Receita" },
    { key: "despesa", label: "Despesa" }
  ]
  return (
    <View className="bg-card rounded-xl p-4">

      {/* HEADER */}
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">
          Transação {cont}
        </Text>

        {canRemove && (
          <TouchableOpacity onPress={() => onRemove(id)}>
            <Text className="text-red-500 font-bold">Remover</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FORMULÁRIO */}
      <View className="gap-4 mt-4">
        {/* Tipo */}
        <View className="gap-2 flex-row items-center">
          <Text className="text-white">Tipo de Transação:</Text>

          <View className="flex-row gap-3">
            {transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.key}
                onPress={() => setTransactionTypeSelected(transaction.key)}
                className={`flex-row items-center px-2 py-2 rounded-lg gap-1 ${
                  transactionTypeSelected === transaction.key ? 'bg-accent' : 'bg-transparent'
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
          leftElement={<Text className="text-gray-500">R$</Text>}
        />

        {/* Data */}
        <DateField />

        {/* Categoria */}
        <View className="flex-row items-center gap-3">
          <Text className="text-white w-24">Categoria:</Text>
          <TextInput className="bg-white flex-1 rounded-lg px-3 py-2" />
        </View>

        {/* Descrição */}
        <View className="gap-3">
          <Text className="text-white">Descrição:</Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-3 h-28"
            multiline
            textAlignVertical="top"
            placeholder="Digite uma descrição..."
            placeholderTextColor="#999"
          />
        </View>
      </View>
    </View>
  )
}
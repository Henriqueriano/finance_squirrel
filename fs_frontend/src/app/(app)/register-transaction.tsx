import { TransactionListItem } from "@/src/components/transaction-list-item"
import { Plus } from "lucide-react-native"
import { useState } from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"

export default function RegisterTransactionScreen() {
  const [data, setData] = useState([{ id: "1" }])
  const [nextId, setNextId] = useState(2)

  function addTransaction() {
    setData((prev) => [...prev, { id: String(nextId) }])

    setNextId((prev) => prev + 1)
  }

  function removeTransaction(id: string) {
    // impede remover o primeiro item
    if (id === "1") return

    setData((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <View className="flex-1 bg-background px-2">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TransactionListItem
            cont={index + 1}
            id={item.id}
            onRemove={removeTransaction}
            canRemove={index !== 0}
          />
        )}
        contentContainerStyle={{
          gap: 8,
          paddingTop: 8,
          paddingBottom: 60,
        }}
      />

      <TouchableOpacity
        onPress={addTransaction}
        className="flex-row items-center bg-accent p-2 gap-2 rounded-lg absolute bottom-2 right-2"
      >
        <Text className="text-white">Adicionar Transação</Text>
        <Plus size={30} color="#235347" />
      </TouchableOpacity>
    </View>
  )
}

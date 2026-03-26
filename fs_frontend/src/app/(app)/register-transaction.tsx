import { TransactionListItem } from "@/src/components/transaction-list-item"
import Entypo from '@expo/vector-icons/Entypo'
import { useState } from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"

export default function RegisterTransactionScreen() {

  const [data, setData] = useState([
    { id: "1" }
  ])
  const [nextId, setNextId] = useState(2)

  function addTransaction() {
    setData((prev) => [
      ...prev,
      { id: String(nextId) }
    ])

    setNextId((prev) => prev + 1)
  }
  
  function removeTransaction(id: string) {
    // impede remover o primeiro item
    if (id === "1") return

    setData((prev) => prev.filter(item => item.id !== id))
  }

  return (
    <View className="flex-1 bg-background p-5">

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
        contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
      />

      <TouchableOpacity
        onPress={addTransaction}
        className="flex-row items-center absolute bottom-5 right-5 bg-accent rounded-xl p-4 gap-2"
      >
        <Text className="text-textPrimary">Adicionar Transação</Text>
        <Entypo name="plus" size={30} color="#235347" />
      </TouchableOpacity>

    </View>
  )
}
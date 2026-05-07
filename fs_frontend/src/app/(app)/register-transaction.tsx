import { TransactionListItem } from "@/src/components/transaction-list-item"
import { useAuth } from "@/src/hooks/use-auth"
import { useTheme } from "@/src/hooks/use-theme"
import { api } from "@/src/services/api"
import { Category } from "@/src/types/category/types"
import { parseCurrencyToCents } from "@/src/utils/parse-currency-to-cents"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { Redirect } from "expo-router"
import { Plus } from "lucide-react-native"
import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

type TransactionForm = {
  id: string
  type: "despesa" | "receita"
  amount: string
  date: Date | null
  category: Category | null
  description: string
}

export default function RegisterTransactionScreen() {
  const { user, isAuthenticated } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [data, setData] = useState<TransactionForm[]>([
    {
      id: "1",
      type: "receita",
      amount: "",
      date: null,
      category: null,
      description: "",
    },
  ])

  const [nextId, setNextId] = useState(2)

  const navigation = useNavigation()

  const isDisabled = data.some(
    (item) => !item.amount || !item.category || !item.date,
  )

  const { colors } = useTheme()
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          backgroundColor: colors.background,
        },
        background: {
          backgroundColor: colors.background,
        },
        text: {
          color: colors.text,
        },
        btn: {
          backgroundColor: colors.btn,
        },
        btnConfirm: {
          backgroundColor: colors.btnConfirm,
        },
      }),
    [colors],
  )

  // Exibir btn salvar no header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          disabled={isDisabled}
          className={`p-2 mr-2 rounded-lg  ${isDisabled ? "bg-gray-400" : ""}`}
          style={isDisabled ? "" : styles.btnConfirm}
        >
          <Text style={styles.text}>Salvar Transações</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation, data, isDisabled])

  function handleChangeCategory(id: string, category: Category | null) {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category } : item)),
    )
  }

  function handleChangeDescription(id: string, description: string) {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, description } : item)),
    )
  }

  function handleChangeAmount(id: string, amount: string) {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount } : item)),
    )
  }

  function handleChangeType(id: string, type: "receita" | "despesa") {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, type } : item)),
    )
  }

  function handleChangeDate(id: string, date: Date | null) {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, date } : item)),
    )
  }

  async function handleSave() {
    try {
      const token = await AsyncStorage.getItem("@token")

      if (!token || !user?.id) return

      const hasInvalid = data.some(
        (item) => !item.amount || !item.category || !item.date,
      )

      if (hasInvalid) {
        console.log("Preencha todos os campos")
        return
      }

      const expenses = data.map((item) => {
        const parsedAmount = parseCurrencyToCents(item.amount)

        return {
          expense_value: parsedAmount,
          expense_date: item.date!.toISOString(),
          expense_type: item.type === "receita",
          category_id: Number(item.category!.id),
          expense_desc: item.description.trim(),
        }
      })

      const payload = {
        user_id: user.id,
        expenses,
      }

      console.log("Payload:", payload)

      await api.post("/expenses/register/", payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      setData([
        {
          id: "1",
          type: "receita",
          amount: "",
          date: null,
          category: null,
          description: "",
        },
      ])
      setCategories([])
      setNextId(2)
    } catch (error) {
      console.error("Erro ao salvar:", error)
    }
  }

  function addTransaction() {
    setData((prev) => [
      ...prev,
      {
        id: String(nextId),
        type: "receita",
        amount: "",
        date: null,
        category: null,
        description: "",
      },
    ])

    setNextId((prev) => prev + 1)
  }

  function removeTransaction(id: string) {
    // impede remover o primeiro item
    if (id === "1") return

    setData((prev) => prev.filter((item) => item.id !== id))
  }

  // Pegar categorias da API
  useEffect(() => {
    async function getCategories() {
      try {
        const token = await AsyncStorage.getItem("@token")

        if (!token || !user?.id) return

        const response = await api.get(`/categories/all/?user_id=${user?.id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        const formatted = response.data.map((item: any) => ({
          id: item.category_id,
          label: item.category_name,
          color: item.category_color,
        }))

        setCategories(formatted)
      } catch (error) {
        console.error("Erro ao recuperar categorias:", error)
      }
    }

    getCategories()
  }, [user?.id])

  if (!isAuthenticated) {
    return <Redirect href="/signin" />
  }

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View className="flex-1 px-2 py-3 gap-3" style={styles.background}>
          {data.map((item, index) => (
            <TransactionListItem
              key={item.id}
              cont={index + 1}
              id={item.id}
              data={item}
              categories={categories}
              onChangeCategory={handleChangeCategory}
              onChangeDescription={handleChangeDescription}
              onChangeAmount={handleChangeAmount}
              onChangeType={handleChangeType}
              onChangeDate={handleChangeDate}
              onRemove={removeTransaction}
              canRemove={index !== 0}
            />
          ))}
        </View>
        <View className="p-10"></View>
      </KeyboardAwareScrollView>
      <TouchableOpacity
        onPress={addTransaction}
        className="flex-row items-center p-2 gap-2 rounded-lg absolute bottom-2 right-2"
        style={styles.btn}
      >
        <Text style={styles.text}>Adicionar Transação</Text>
        <Plus size={30} color={colors.icon} />
      </TouchableOpacity>
    </>
  )
}

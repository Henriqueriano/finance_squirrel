import { useAuth } from "@/src/hooks/use-auth"
import { api } from "@/src/services/api"
import { Category } from "@/src/types/category/types"
import { formatCurrency } from "@/src/utils/format-currency"
import { formatDateToMonthYear } from "@/src/utils/format-date-to-month-year"
import { parseDate } from "@/src/utils/parse-date"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Redirect, useFocusEffect } from "expo-router"
import { ChevronDown } from "lucide-react-native"
import { useCallback, useMemo, useState } from "react"
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native"

type listItem = {
  id: string
  date: string
  categorie: string
  description: string
  value: number
  type: string
}

type Expense = {
  id: string
  amount: string
  date: Date
  type: boolean
  category: string
  desc: string
}

export default function TransactionHistoryScreen() {
  const { user, isAuthenticated } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    string | null
  >(null)
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null)

  const [modalVisivel, setModalVisivel] = useState(false)
  const [filtroAtivo, setFiltroAtivo] = useState<
    "tipo" | "categoria" | "data" | null
  >(null)
  const [ordenarPor, setOrdenarPor] = useState<"data" | "valor">("data")

  const tipos = ["Receita", "Despesa"]

  const datas = useMemo(() => {
    if (!expenses.length) return []

    const anos = expenses.map((exp) => exp.date.getFullYear())

    const anosUnicos = [...new Set(anos)]

    return anosUnicos.sort((a, b) => b - a).map(String)
  }, [expenses])

  const normalizedData = useMemo(() => {
    if (!expenses.length || !categories.length) return []

    return expenses.map((exp) => {
      const category = categories.find((cat) => cat.id === exp.category)

      return {
        id: exp.id,
        date: formatDateToMonthYear(exp.date),
        categorie: category?.label ?? "Sem categoria",
        description: exp.desc,
        value: Number(exp.amount),
        type: exp.type ? "Receita" : "Despesa",
      }
    })
  }, [expenses, categories])

  const finalData = useMemo(() => {
    let result = [...normalizedData]

    // FILTRO
    result = result.filter((item) => {
      const matchTipo = tipoSelecionado ? item.type === tipoSelecionado : true

      const matchCategoria = categoriaSelecionada
        ? item.categorie === categoriaSelecionada
        : true

      const matchData = dataSelecionada
        ? item.date.includes(dataSelecionada)
        : true

      return matchTipo && matchCategoria && matchData
    })

    // ORDENAÇÃO
    if (ordenarPor === "data") {
      result.sort(
        (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime(),
      )
    }

    if (ordenarPor === "valor") {
      result.sort((a, b) => b.value - a.value)
    }

    return result
  }, [
    normalizedData,
    tipoSelecionado,
    categoriaSelecionada,
    dataSelecionada,
    ordenarPor,
  ])

  const TableHeader = () => (
    <View className="flex-row gap-2 border-b border-gray-600 py-2 bg-background">
      <Text className="flex-1 text-accent font-bold text-xs">Data</Text>
      <Text className="flex-1 text-accent font-bold text-xs">Categoria</Text>
      <Text className="flex-1 text-accent font-bold text-xs">Descrição</Text>
      <Text className="flex-1 text-accent font-bold text-xs">Valor</Text>
      <Text className="flex-1 text-accent font-bold text-xs">Tipo</Text>
    </View>
  )
  const renderItem = ({ item }: { item: listItem }) => (
    <View className="flex-row gap-2 py-1 border-b border-gray-800">
      <Text className="flex-1 text-white text-xs">{item.date}</Text>
      <Text className="flex-1 text-white text-xs">{item.categorie}</Text>
      <Text className="flex-1 text-white text-xs" numberOfLines={1}>
        {item.description}
      </Text>
      <Text className="flex-1 text-white text-xs">
        {formatCurrency(item.value)}
      </Text>
      <Text className="flex-1 text-white text-xs">{item.type}</Text>
    </View>
  )

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated || !user?.id) return

      async function getCategories() {
        try {
          const token = await AsyncStorage.getItem("@token")

          if (!token) return

          const response = await api.get(
            `/categories/all/?user_id=${user?.id}`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            },
          )

          const formattedCategories = response.data.map((item: any) => ({
            id: item.category_id,
            label: item.category_name,
            color: item.category_color,
          }))

          setCategories(formattedCategories)
        } catch (error) {
          console.error("Erro ao buscar categorias:", error)
        }
      }

      getCategories()
    }, [isAuthenticated, user]),
  )

  useFocusEffect(
    useCallback(() => {
      async function getExpenses() {
        try {
          const token = await AsyncStorage.getItem("@token")
          if (!token || !user?.id) return

          const response = await api.get(`/expenses/all/?user_id=${user?.id}`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })

          const formattedExpenses = response.data.map((item: any) => ({
            id: item.expense_id,
            amount: Number(item.expense_value),
            date: new Date(item.expense_date),
            type: !!item.expense_type,
            category: item.category_id,
            desc: item.expense_desc,
          }))

          setExpenses(formattedExpenses)
        } catch (error) {
          console.error("Erro ao buscar expenses:", error)
        }
      }

      getExpenses()
    }, [user]),
  )

  if (!isAuthenticated) {
    return <Redirect href="/signin" />
  }

  return (
    <View className="flex-1 bg-background p-2 gap-6">
      <View className="gap-4">
        {/* FILTROS */}
        <View className="gap-2">
          <Text className="text-white text-2xl font-bold mt-2">Filtros:</Text>
          <View className="flex-row gap-2 bg-card p-2 rounded-lg items-center">
            <TouchableOpacity
              className="flex-1 bg-accent p-2 rounded-lg justify-center"
              onPress={() => {
                setFiltroAtivo("tipo")
                setModalVisivel(true)
              }}
            >
              {tipoSelecionado ? (
                <View className="flex-row justify-between items-center">
                  <Text className="text-white">{tipoSelecionado}</Text>
                  <ChevronDown size={24} color="#235347" />
                </View>
              ) : (
                <View className="flex-row justify-between items-center">
                  <Text className="text-white">Tipo</Text>
                  <ChevronDown size={24} color="#235347" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-accent p-2 rounded-lg"
              onPress={() => {
                setFiltroAtivo("categoria")
                setModalVisivel(true)
              }}
            >
              {categoriaSelecionada ? (
                <View className="flex-row justify-between items-center">
                  <Text className="text-white">{categoriaSelecionada}</Text>
                  <ChevronDown size={24} color="#235347" />
                </View>
              ) : (
                <View className="flex-row justify-between items-center">
                  <Text className="text-white">Categoria</Text>
                  <ChevronDown size={24} color="#235347" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-accent p-2 rounded-lg"
              onPress={() => {
                setFiltroAtivo("data")
                setModalVisivel(true)
              }}
            >
              {dataSelecionada ? (
                <View className="flex-row justify-between items-center">
                  <Text className="text-white">{dataSelecionada}</Text>
                  <ChevronDown size={24} color="#235347" />
                </View>
              ) : (
                <View className="flex-row justify-between items-center">
                  <Text className="text-white">Data</Text>
                  <ChevronDown size={24} color="#235347" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ORDENAÇÃO */}
        <View className="gap-2">
          <Text className="text-white text-2xl font-bold">Ordenar por:</Text>
          <View className="flex-row bg-card p-2 rounded-lg justify-between">
            <TouchableOpacity
              className={`w-[50%] py-2 rounded-lg justify-center items-center ${
                ordenarPor === "data" ? "bg-accent" : ""
              }`}
              onPress={() => setOrdenarPor("data")}
            >
              <Text className="text-white">Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-[50%] py-2 rounded-lg justify-center items-center ${
                ordenarPor === "valor" ? "bg-accent" : ""
              }`}
              onPress={() => setOrdenarPor("valor")}
            >
              <Text className="text-white">Valor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* LISTA */}
      <FlatList
        data={finalData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={TableHeader}
        stickyHeaderIndices={[0]} // header fixo
        contentContainerStyle={{ gap: 6 }}
      />

      <Modal visible={modalVisivel} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setModalVisivel(false)}
        >
          <View className="bg-card w-4/5 rounded-xl p-4 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-white text-xl mb-2">
                {(filtroAtivo === "tipo"
                  ? "Tipo"
                  : filtroAtivo === "categoria"
                    ? "Categorias"
                    : "Data") + ":"}
              </Text>
              <TouchableOpacity
                className="p-2 bg-blue-400 rounded-lg"
                onPress={() => {
                  if (filtroAtivo === "tipo") setTipoSelecionado(null)
                  if (filtroAtivo === "categoria") setCategoriaSelecionada(null)
                  if (filtroAtivo === "data") setDataSelecionada(null)
                  setModalVisivel(false)
                }}
              >
                <Text className="text-white">Limpar Filtro</Text>
              </TouchableOpacity>
            </View>

            {/* Filtros */}
            {(filtroAtivo === "tipo"
              ? tipos
              : filtroAtivo === "categoria"
                ? categories.map((cat) => cat.label)
                : datas
            ).map((item) => (
              <TouchableOpacity
                key={item}
                className="p-2 bg-accent rounded-lg"
                onPress={() => {
                  if (filtroAtivo === "tipo") setTipoSelecionado(item)
                  if (filtroAtivo === "categoria") setCategoriaSelecionada(item)
                  if (filtroAtivo === "data") setDataSelecionada(item)

                  setModalVisivel(false)
                }}
              >
                <Text className="text-white">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

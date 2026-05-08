import { useAuth } from "@/src/hooks/use-auth"
import { useTheme } from "@/src/hooks/use-theme"
import { api } from "@/src/services/api"
import { Category } from "@/src/types/category/types"
import { capitalizeFirstLetter } from "@/src/utils/capitalize-first-letter"
import { formatCurrency } from "@/src/utils/format-currency"
import { formatDateToMonthYear } from "@/src/utils/format-date-to-month-year"
import { parseDate } from "@/src/utils/parse-date"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Redirect, useFocusEffect } from "expo-router"
import { ChevronDown } from "lucide-react-native"
import { useCallback, useMemo, useState } from "react"
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

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
  value: string
  date: Date
  type: boolean
  category: string
  desc: string
}

const expenseTypes = ["Receita", "Despesa"]

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

  const { colors } = useTheme()
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.background,
        },
        card: {
          backgroundColor: colors.card,
        },
        text: {
          color: colors.text,
        },
        btn: {
          backgroundColor: colors.btn,
        },
        accent: {
          color: colors.accent,
        },
      }),
    [colors],
  )

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
        categorie: category?.name ?? "Sem categoria",
        description: exp.desc,
        value: Number(exp.value),
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
    <View
      className="flex-row gap-2 border-b border-gray-600 py-2"
      style={styles.container}
    >
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

  const renderItem = ({ item }: { item: listItem }) => (
    <View className="flex-row gap-2 py-1 border-b border-gray-800">
      <Text className="flex-1 text-xs" style={styles.text}>
        {item.date}
      </Text>
      <Text className="flex-1 text-xs" style={styles.text}>
        {item.categorie}
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

  // GET categories
  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated || !user?.id) return

      async function getCategories() {
        try {
          const token = await AsyncStorage.getItem("@token")

          if (!token) return

          const response = await api.get("/categories/", {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })

          setCategories(response.data)
        } catch (error) {
          console.error("Erro ao buscar categorias:", error)
        }
      }

      getCategories()
    }, [isAuthenticated, user]),
  )

  // GET expenses
  useFocusEffect(
    useCallback(() => {
      async function getExpenses() {
        try {
          const token = await AsyncStorage.getItem("@token")
          if (!token || !user?.id) return

          const response = await api.get("/expenses/", {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })

          const formattedExpenses = response.data.map((item: any) => ({
            id: item.id,
            value: Number(item.value) / 100,
            date: new Date(item.date),
            type: !!item.type,
            category: item.category_id,
            desc: item.description,
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
    <View className="flex-1 p-2 gap-6" style={styles.container}>
      <View className="gap-4">
        {/* FILTROS */}
        <View className="gap-2">
          <Text className="text-2xl font-bold mt-2" style={styles.text}>
            Filtros:
          </Text>
          <View
            className="flex-row gap-2 p-2 rounded-lg items-center"
            style={styles.card}
          >
            <TouchableOpacity
              className="flex-1 p-2 rounded-lg justify-center"
              onPress={() => {
                setFiltroAtivo("tipo")
                setModalVisivel(true)
              }}
              style={styles.btn}
            >
              {tipoSelecionado ? (
                <View className="flex-row justify-between items-center">
                  <Text style={styles.text}>{tipoSelecionado}</Text>
                  <ChevronDown size={24} color={colors.icon} />
                </View>
              ) : (
                <View className="flex-row justify-between items-center">
                  <Text style={styles.text}>Tipo</Text>
                  <ChevronDown size={24} color={colors.icon} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 p-2 rounded-lg"
              onPress={() => {
                setFiltroAtivo("categoria")
                setModalVisivel(true)
              }}
              style={styles.btn}
            >
              {categoriaSelecionada ? (
                <View className="flex-row justify-between items-center">
                  <Text style={styles.text}>{categoriaSelecionada}</Text>
                  <ChevronDown size={24} color={colors.icon} />
                </View>
              ) : (
                <View className="flex-row justify-between items-center">
                  <Text style={styles.text}>Categoria</Text>
                  <ChevronDown size={24} color={colors.icon} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 p-2 rounded-lg"
              onPress={() => {
                setFiltroAtivo("data")
                setModalVisivel(true)
              }}
              style={styles.btn}
            >
              {dataSelecionada ? (
                <View className="flex-row justify-between items-center">
                  <Text style={styles.text}>{dataSelecionada}</Text>
                  <ChevronDown size={24} color={colors.icon} />
                </View>
              ) : (
                <View className="flex-row justify-between items-center">
                  <Text style={styles.text}>Data</Text>
                  <ChevronDown size={24} color={colors.icon} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ORDENAÇÃO */}
        <View className="gap-2">
          <Text className=" text-2xl font-bold" style={styles.text}>
            Ordenar por:
          </Text>
          <View
            className="flex-row p-2 rounded-lg justify-between"
            style={styles.card}
          >
            <TouchableOpacity
              className="w-[50%] py-2 rounded-lg justify-center items-center"
              style={ordenarPor === "data" ? styles.btn : ""}
              onPress={() => setOrdenarPor("data")}
            >
              <Text style={styles.text}>Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[50%] py-2 rounded-lg justify-center items-center"
              style={ordenarPor === "valor" ? styles.btn : ""}
              onPress={() => setOrdenarPor("valor")}
            >
              <Text style={styles.text}>Valor</Text>
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
          <View className="w-4/5 rounded-xl p-4 gap-2" style={styles.card}>
            {/* Título e Btn limpar */}
            <View className="flex-row justify-between">
              <Text className="text-xl mb-2" style={styles.text}>
                {capitalizeFirstLetter(filtroAtivo?.toString()) + ":"}
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
                <Text style={styles.text}>Limpar Filtro</Text>
              </TouchableOpacity>
            </View>

            {/* Filtros */}
            {(filtroAtivo === "tipo"
              ? expenseTypes
              : filtroAtivo === "categoria"
                ? categories.map((cat) => cat.name)
                : datas
            ).map((item) => (
              <TouchableOpacity
                key={item}
                className="p-2 rounded-lg"
                style={styles.btn}
                onPress={() => {
                  if (filtroAtivo === "tipo") setTipoSelecionado(item)
                  if (filtroAtivo === "categoria") setCategoriaSelecionada(item)
                  if (filtroAtivo === "data") setDataSelecionada(item)

                  setModalVisivel(false)
                }}
              >
                <Text style={styles.text}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

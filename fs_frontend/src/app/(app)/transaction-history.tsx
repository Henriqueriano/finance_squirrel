import { TransactionListItem } from "@/src/components/transaction-list-item"
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
import { ChevronDown, Expand, Pencil, Trash } from "lucide-react-native"
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
  // Filtros
  const [modalVisivel, setModalVisivel] = useState(false)
  const [filtroAtivo, setFiltroAtivo] = useState<
    "tipo" | "categoria" | "data" | null
  >(null)
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    string | null
  >(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null)
  // Ordenação
  const [ordenarPor, setOrdenarPor] = useState<"data" | "valor">("data")
  // Funcionalidade p/ transação selecionada
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<listItem | null>(null)

  const [expenses, setExpenses] = useState<Expense[]>([])

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

  const renderItem = ({ item }: { item: listItem }) => {
    const isSelected = selectedTransaction?.id === item.id

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedTransaction((prev) => (prev?.id === item.id ? null : item))
        }}
      >
        <View
          className="flex-row gap-2 py-2 border-b border-gray-800 rounded-lg px-1"
          style={[
            isSelected && {
              backgroundColor: colors.btn,
            },
          ]}
        >
          <Text className="flex-1 text-xs" style={styles.text}>
            {item.date}
          </Text>

          <Text className="flex-1 text-xs" style={styles.text}>
            {item.categorie}
          </Text>

          <Text
            className="flex-1 text-xs"
            style={styles.text}
            numberOfLines={1}
          >
            {item.description}
          </Text>

          <Text className="flex-1 text-xs" style={styles.text}>
            {formatCurrency(item.value)}
          </Text>

          <Text className="flex-1 text-xs" style={styles.text}>
            {item.type}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  async function handleDeleteTransaction() {
    try {
      const token = await AsyncStorage.getItem("@token")

      if (!token) return

      const response = await api.delete(
        `/expenses/${selectedTransaction?.id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      )
      const removed = response.data
      setExpenses((prev) => prev.filter((item) => item.id !== removed?.id))
      setSelectedTransaction(null)
    } catch (err) {
      console.log("Erro ao deletar transação:", err)
    }
  }

  async function handleUpdateTransaction() {
    try {
      const token = await AsyncStorage.getItem("@token")

      if (!token || !editingTransaction) return

      const payload = {
        value: Number(editingTransaction.value) * 100,
        date: editingTransaction.date,
        type: editingTransaction.type === "receita",
        category_id: editingTransaction.category.id,
        description: editingTransaction.description,
      }

      const response = await api.patch(
        `/expenses/${editingTransaction.id}`,
        payload,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      )

      const updated = response.data

      const formattedUpdatedExpense: Expense = {
        id: updated.id,
        value: (Number(updated.value) / 100).toString(),
        date: new Date(updated.date),
        type: !!updated.type,
        category: updated.category_id,
        desc: updated.description,
      }

      setExpenses((prev) =>
        prev.map((item) =>
          item.id === formattedUpdatedExpense.id
            ? formattedUpdatedExpense
            : item,
        ),
      )

      setSelectedTransaction(null)
      setEditModalVisible(false)
    } catch (err) {
      console.log("Erro ao atualizar transação:", err)
    }
  }

  function handleOpenEditModal() {
    if (!selectedTransaction) return

    const originalExpense = expenses.find(
      (exp) => exp.id === selectedTransaction.id,
    )

    if (!originalExpense) return

    const category =
      categories.find((cat) => cat.id === originalExpense.category) || null

    setEditingTransaction({
      id: originalExpense.id,
      type: originalExpense.type ? "receita" : "despesa",
      value: String(originalExpense.value),
      date: originalExpense.date,
      category,
      description: originalExpense.desc,
    })

    setEditModalVisible(true)
  }

  function updateEditingTransaction(field: string, value: any) {
    setEditingTransaction((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

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
    <View className="flex-1 p-2 gap-4" style={styles.container}>
      <View className="gap-4">
        {/* FILTROS */}
        <View className="gap-2">
          <Text className="text-xl font-bold mt-2" style={styles.text}>
            Filtros:
          </Text>
          <View
            className="flex-row gap-2 p-2 rounded-lg items-center"
            style={styles.card}
          >
            <TouchableOpacity
              className="flex-1 p-2 rounded-lg"
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
          <Text className="text-xl font-bold" style={styles.text}>
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

        {/* Funções sobre a Transação */}
        <View className="gap-2">
          <Text className="text-xl font-bold" style={styles.text}>
            Transação selecionada:
          </Text>

          <View className="flex-row p-2 rounded-xl gap-2" style={styles.card}>
            <TouchableOpacity
              disabled={!selectedTransaction}
              className="flex-1 items-center p-2 rounded-md"
              style={[
                styles.btn,
                !selectedTransaction && {
                  opacity: 0.4,
                },
              ]}
              onPress={() => setDetailsModalVisible(true)}
            >
              <Expand size={24} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!selectedTransaction}
              className="flex-1 items-center p-2 rounded-md"
              style={[
                styles.btn,
                !selectedTransaction && {
                  opacity: 0.4,
                },
              ]}
              onPress={handleOpenEditModal}
            >
              <Pencil size={24} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!selectedTransaction}
              className="flex-1 items-center p-2 rounded-md"
              style={[
                styles.btn,
                !selectedTransaction && {
                  opacity: 0.4,
                },
              ]}
              onPress={() => setDeleteModalVisible(true)}
            >
              <Trash size={24} color={colors.text} />
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

      {/* Modal para filtros */}
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

      {/* Modal para visualizar transação */}
      <Modal visible={detailsModalVisible} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 bg-black/50 justify-center items-center p-4"
          onPress={() => setDetailsModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="w-full rounded-2xl p-4 gap-4"
            style={styles.card}
          >
            <Text className="text-2xl font-bold" style={styles.text}>
              Detalhes da Transação
            </Text>

            <View className="gap-3">
              <View>
                <Text style={styles.accent}>Descrição</Text>
                <Text style={styles.text}>
                  {selectedTransaction?.description}
                </Text>
              </View>

              <View>
                <Text style={styles.accent}>Categoria</Text>
                <Text style={styles.text}>
                  {selectedTransaction?.categorie}
                </Text>
              </View>

              <View>
                <Text style={styles.accent}>Tipo</Text>
                <Text style={styles.text}>{selectedTransaction?.type}</Text>
              </View>

              <View>
                <Text style={styles.accent}>Data</Text>
                <Text style={styles.text}>{selectedTransaction?.date}</Text>
              </View>

              <View>
                <Text style={styles.accent}>Valor</Text>
                <Text style={styles.text}>
                  {formatCurrency(selectedTransaction?.value ?? 0)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="p-3 rounded-xl items-center"
              style={styles.btn}
              onPress={() => setDetailsModalVisible(false)}
            >
              <Text style={styles.text}>Fechar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal para editar transação */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="rounded-2xl p-4 max-h-[90%]" style={styles.card}>
            <Text className="text-2xl font-bold" style={styles.text}>
              Editar Transação
            </Text>

            {editingTransaction && (
              <TransactionListItem
                title=""
                id={editingTransaction.id}
                cont={1}
                data={editingTransaction}
                categories={categories}
                canRemove={false}
                onRemove={() => {}}
                onChangeType={(_, value) =>
                  updateEditingTransaction("type", value)
                }
                onChangeValue={(_, value) =>
                  updateEditingTransaction("value", value)
                }
                onChangeDate={(_, value) =>
                  updateEditingTransaction("date", value)
                }
                onChangeCategory={(_, value) =>
                  updateEditingTransaction("category", value)
                }
                onChangeDescription={(_, value) =>
                  updateEditingTransaction("description", value)
                }
              />
            )}

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 p-3 rounded-xl items-center"
                style={styles.btn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.text}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 p-3 rounded-xl items-center bg-green-500"
                onPress={handleUpdateTransaction}
              >
                <Text className="text-white font-bold">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para confirmar remoção */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 bg-black/50 justify-center items-center p-4"
          onPress={() => setDeleteModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="w-full rounded-2xl p-4 gap-6"
            style={styles.card}
          >
            <View className="gap-2">
              <Text className="text-2xl font-bold" style={styles.text}>
                Excluir Transação
              </Text>

              <Text style={styles.text}>
                Tem certeza que deseja excluir esta transação?
              </Text>

              <View className="p-3 rounded-xl" style={styles.btn}>
                <Text style={styles.text}>
                  {selectedTransaction?.description}
                </Text>

                <Text style={styles.text}>
                  {formatCurrency(selectedTransaction?.value ?? 0)}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 p-3 rounded-xl items-center"
                style={styles.btn}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.text}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 p-3 rounded-xl items-center bg-red-500"
                onPress={() => {
                  handleDeleteTransaction()
                  setDeleteModalVisible(false)
                }}
              >
                <Text className="text-white font-bold">Excluir</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

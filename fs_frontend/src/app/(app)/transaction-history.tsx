import { formatCurrency } from "@/src/utils/format-currency"
import { parseDate } from "@/src/utils/parse-date"
import AntDesign from '@expo/vector-icons/AntDesign'

import { useMemo, useState } from "react"
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View
} from "react-native"

const data = [
  { id: "1", date: "Jun/2026", categorie: "Alimentação", description: "...", value: 10, type: "Despesa" },
  { id: "2", date: "Dez/2025", categorie: "Jogos", description: "Minecraft", value: 109.90, type: "Despesa" },
  { id: "3", date: "Jan/2026", categorie: "Alimentação", description: "Arroz, Feijão", value: 17.90, type: "Despesa" },
  { id: "4", date: "Abr/2025", categorie: "Alimentação", description: "Macarrão, Leite", value: 9.50, type: "Despesa" },
  { id: "5", date: "Fev/2026", categorie: "Transporte", description: "Uber", value: 23.40, type: "Despesa" },
  { id: "6", date: "Mar/2026", categorie: "Salário", description: "Empresa X", value: 3500, type: "Receita" },
  { id: "7", date: "Jan/2025", categorie: "Lazer", description: "Cinema", value: 45.00, type: "Despesa" },
  { id: "8", date: "Out/2025", categorie: "Saúde", description: "Farmácia", value: 78.20, type: "Despesa" },
  { id: "9", date: "Nov/2025", categorie: "Educação", description: "Curso online", value: 199.90, type: "Despesa" },
  { id: "10", date: "Ago/2026", categorie: "Freelance", description: "Projeto React", value: 800, type: "Receita" },
  { id: "11", date: "Jul/2026", categorie: "Alimentação", description: "Restaurante", value: 65.30, type: "Despesa" },
  { id: "12", date: "Set/2025", categorie: "Transporte", description: "Combustível", value: 150, type: "Despesa" },
  { id: "13", date: "Mai/2026", categorie: "Investimentos", description: "Dividendos", value: 120.50, type: "Receita" },
  { id: "14", date: "Abr/2026", categorie: "Moradia", description: "Aluguel", value: 1200, type: "Despesa" },
  { id: "15", date: "Jun/2025", categorie: "Lazer", description: "Viagem", value: 950, type: "Despesa" },
  { id: "16", date: "Fev/2025", categorie: "Saúde", description: "Consulta médica", value: 200, type: "Despesa" },
  { id: "17", date: "Mar/2025", categorie: "Salário", description: "Empresa X", value: 3200, type: "Receita" },
  { id: "18", date: "Out/2026", categorie: "Educação", description: "Faculdade", value: 600, type: "Despesa" },
  { id: "19", date: "Dez/2026", categorie: "Bônus", description: "Fim de ano", value: 1500, type: "Receita" },
  { id: "20", date: "Nov/2026", categorie: "Alimentação", description: "Supermercado", value: 230.75, type: "Despesa" }
]

type listItem = {
  id: string
  date: string
  categorie: string
  description: string
  value: number
  type: string
}

export default function TransactionHistoryScreen() {
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null)
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null)

  const [modalVisivel, setModalVisivel] = useState(false)
  const [filtroAtivo, setFiltroAtivo] = useState<"tipo" | "categoria" | "data" | null>(null)
  const [ordenarPor, setOrdenarPor] = useState<"data" | "valor">("data")

  const tipos = ["Receita", "Despesa"]

  const categorias = [
    "Alimentação",
    "Transporte",
    "Lazer",
    "Saúde",
    "Educação",
    "Moradia"
  ]

  const datas = ["2026", "2025"]

  const finalData = useMemo(() => {
    let result = [...data]

    // 🔎 FILTRO
    result = result.filter((item) => {
      const matchTipo = tipoSelecionado
        ? item.type === tipoSelecionado
        : true

      const matchCategoria = categoriaSelecionada
        ? item.categorie === categoriaSelecionada
        : true

      const matchData = dataSelecionada
        ? item.date.includes(dataSelecionada)
        : true

      return matchTipo && matchCategoria && matchData
    })

    // 🔃 ORDENAÇÃO
    if (ordenarPor === "data") {
      result.sort(
        (a, b) =>
          parseDate(b.date).getTime() - parseDate(a.date).getTime()
      )
    }

    if (ordenarPor === "valor") {
      result.sort((a, b) => b.value - a.value)
    }

    return result
  }, [
    data,
    tipoSelecionado,
    categoriaSelecionada,
    dataSelecionada,
    ordenarPor
  ])

  const TableHeader = () => (
    <View className="flex-row border-b border-gray-600 pb-1 bg-background">
      <Text className="flex-1 text-accent font-bold text-xs">Data</Text>
      <Text className="flex-1 text-accent font-bold text-xs">Categoria</Text>
      <Text className="flex-1 text-accent font-bold text-xs">Descrição</Text>
      <Text className="flex-1 text-accent font-bold text-xs">Valor</Text>
      <Text className="flex-1 text-accent font-bold text-xs">Tipo</Text>
    </View>
  ) 
  const renderItem = ({ item }: { item: listItem }) => (
    <View className="flex-row py-1 border-b border-gray-800">
      <Text className="flex-1 text-textPrimary text-xs">{item.date}</Text>
      <Text className="flex-1 text-textPrimary text-xs">{item.categorie}</Text>
      <Text className="flex-1 text-textPrimary text-xs" numberOfLines={1}>
        {item.description}
      </Text>
      <Text className="flex-1 text-textPrimary text-xs">
        {formatCurrency(item.value)}
      </Text>
      <Text className="flex-1 text-textPrimary text-xs">{item.type}</Text>
    </View>
  )

  return (
    <View className="flex-1 bg-background p-5 gap-5">
      <Text className="text-textPrimary font-bold text-2xl">
        Histórico Financeiro
      </Text>

      {/* FILTROS */}
      <View className="bg-card p-2 rounded-xl gap-2">
        <Text className="text-textPrimary text-xl font-medium">
          Filtros:
        </Text>

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 bg-accent p-2 rounded-lg justify-center"
            onPress={() => {
              setFiltroAtivo("tipo")
              setModalVisivel(true)
            }}
          >
            {tipoSelecionado ? (
              <View className="flex-row justify-between items-center">
                <Text className="text-textPrimary">{tipoSelecionado}</Text> 
                <AntDesign name="caret-down" size={24} color="#235347" />
              </View>
            ) : (
              <View className="flex-row justify-between items-center">
                <Text className="text-textPrimary">Tipo</Text> 
                <AntDesign name="caret-down" size={24} color="#235347" />
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
                <Text className="text-textPrimary">{categoriaSelecionada}</Text> 
                <AntDesign name="caret-down" size={24} color="#235347" />
              </View>
            ) : (
              <View className="flex-row justify-between items-center">
                <Text className="text-textPrimary">Categoria</Text> 
                <AntDesign name="caret-down" size={24} color="#235347" />
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
                <Text className="text-textPrimary">{dataSelecionada}</Text> 
                <AntDesign name="caret-down" size={24} color="#235347" />
              </View>
            ) : (
              <View className="flex-row justify-between items-center">
                <Text className="text-textPrimary">Data</Text> 
                <AntDesign name="caret-down" size={24} color="#235347" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ORDENAÇÃO */}
      <View className="flex-row gap-2 bg-card p-2 rounded-xl items-center">
        <Text className="text-textPrimary text-xl font-medium">Ordenar por:</Text>
        <TouchableOpacity
          className={`px-3 py-2 rounded-lg ${
            ordenarPor === "data" ? "bg-accent" : ""
          }`}
          onPress={() => setOrdenarPor("data")}
        >
          <Text className="text-textPrimary">Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-3 py-2 rounded-lg ${
            ordenarPor === "valor" ? "bg-accent" : ""
          }`}
          onPress={() => setOrdenarPor("valor")}
        >
          <Text className="text-textPrimary">Valor</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        data={finalData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={TableHeader}
        stickyHeaderIndices={[0]} // 🔥 header fixo
        contentContainerStyle={{ gap: 6 }}
      />

      <Modal visible={modalVisivel} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setModalVisivel(false)}
        >
          <View className="bg-card w-4/5 rounded-xl p-4 gap-2">
            <TouchableOpacity
              className="p-2 bg-accent rounded-lg"
              onPress={() => {
                if (filtroAtivo === "tipo") setTipoSelecionado(null)
                if (filtroAtivo === "categoria") setCategoriaSelecionada(null)
                if (filtroAtivo === "data") setDataSelecionada(null)
                setModalVisivel(false)
              }}
            >
              <Text className="text-textPrimary">Nenhum</Text>
            </TouchableOpacity>
            {(filtroAtivo === "tipo" ? tipos :
              filtroAtivo === "categoria" ? categorias :
              datas
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
                <Text className="text-textPrimary">{item}</Text>
              </TouchableOpacity>
            ))}

          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}
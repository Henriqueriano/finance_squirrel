import { useAuth } from "@/src/hooks/use-auth"
import { api } from "@/src/services/api"
import { Category } from "@/src/types/category/types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Redirect } from "expo-router"
import { Pencil, Plus, Trash, X } from "lucide-react-native"
import React, { useEffect, useState } from "react"
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const colorOptions = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#22c55e",
  "#2dd4bf",
  "#38bdf8",
  "#60a5fa",
  "#818cf8",
  "#c084fc",
  "#e879f9",
  "#f472b6",
]

export default function CategoriesScreen() {
  const { user, isAuthenticated } = useAuth()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#f87171")
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<Category[]>([])

  async function handleAddCategory() {
    console.log(user)

    try {
      if (!categoryName.trim()) return

      const token = await AsyncStorage.getItem("@token")
      if (!token || !user?.id) return

      const body = {
        category_name: categoryName.trim(),
        category_color: selectedColor,
      }

      const response = await api.post("/categories/register/", body, {
        headers: {
          authorization: `Bearer ${token}`,
          "x-request-id": user.id,
        },
      })

      const created = {
        id: Date.now().toString(),
        label: response.data.category_name,
        color: response.data.category_color,
      }

      setCategories((prev) => [...prev, created])

      console.log(user)

      // reset
      setCategoryName("")
      setSelectedColor("#f87171")
      setModalVisible(false)
    } catch (error) {
      console.error("Erro ao criar categoria:", error)
    }
  }

  const filteredCategories = categories.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  )

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    async function getCategories() {
      try {
        const token = await AsyncStorage.getItem("@token")

        if (!token) return

        console.log("categorias", token)

        const response = await api.get("/categories/all/", {
          headers: {
            authorization: `Bearer ${token}`,
            "x-request-id": user?.id,
          },
        })

        const formatted = response.data.map((item: any) => ({
          id: new Date().toString(),
          label: item.category_name,
          color: item.category_color,
        }))

        setCategories(formatted)
      } catch (error) {
        console.error("Erro ao buscar categorias:", error)
      }
    }

    getCategories()
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return <Redirect href="/signin" />
  }

  return (
    <View className="flex-1 bg-background p-5 gap-5">
      <Text className="text-2xl text-white font-bold">Buscar categorias:</Text>

      <TextInput
        className="bg-white rounded-lg p-5"
        placeholder="Digite a categoria..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row gap-2 items-center"
            activeOpacity={1}
            onPress={() => {
              setSelectedCategory(item.label)
            }}
          >
            <View
              className="w-10 h-10 rounded-full border border-lightBorder items-center justify-center"
              style={{ backgroundColor: item.color }}
            >
              {selectedCategory === item.label ? (
                <View className="h-4 w-4 bg-white rounded-xl" />
              ) : (
                <View />
              )}
            </View>
            <Text className="text-white text-xl">{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      <View className="absolute bottom-5 right-5 gap-2">
        {selectedCategory && (
          <View className="flex-row gap-2 justify-end">
            <TouchableOpacity
              className="p-3 bg-menuColor rounded-full"
              onPress={() => {
                setSelectedCategory("")
              }}
            >
              <Pencil size={20} color={"#f5f5f5"} />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-3 bg-menuColor rounded-full"
              onPress={() => {
                setSelectedCategory("")
              }}
            >
              <Trash size={20} color={"#f5f5f5"} />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-3 bg-menuColor rounded-full"
              onPress={() => {
                setSelectedCategory("")
              }}
            >
              <X size={20} color={"#f5f5f5"} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          className="flex-row items-center bg-accent px-4 py-3 rounded-lg"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white">Nova Categoria</Text>
          <Plus size={30} color={"#235347"} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} className="w-[90%]">
            <View className="bg-card p-5 rounded-2xl gap-4">
              <Text className="text-white text-xl font-bold">
                Nova Categoria
              </Text>

              {/* Input nome */}
              <TextInput
                placeholder="Nome da categoria"
                value={categoryName}
                onChangeText={setCategoryName}
                className="bg-white rounded-lg p-3"
              />

              {/* Preview da cor */}
              <View className="flex-row items-center gap-2">
                <View
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
                <Text className="text-white">Cor selecionada</Text>
              </View>

              {/* Seletor de cores */}
              <Text className="text-white">Selecione uma cor:</Text>

              <View className="flex-row flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      selectedColor === color ? "border-2 border-white" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <View className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Botões */}
              <View className="flex-row items-center justify-end gap-3 mt-3">
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false)
                    setCategoryName("")
                  }}
                >
                  <Text className="text-white">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`px-4 py-2 rounded-lg ${
                    categoryName.trim() ? "bg-accent" : "bg-gray-400"
                  }`}
                  disabled={!categoryName.trim()}
                  onPress={handleAddCategory}
                >
                  <Text className="text-white">Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

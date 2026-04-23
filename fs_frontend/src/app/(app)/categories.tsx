import { useAuth } from "@/src/hooks/use-auth"
import { api } from "@/src/services/api"
import { Category } from "@/src/types/category/types"
import { colorOptions } from "@/src/utils/categories-colors"
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

export default function CategoriesScreen() {
  const { user, isAuthenticated } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [categoryName, setCategoryName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#f87171")
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editSelectedColor, setEditSelectedColor] = useState("#f87171")

  async function handleAddCategory() {
    try {
      if (!categoryName.trim()) return

      const token = await AsyncStorage.getItem("@token")

      if (!token || !user?.id) return

      const body = {
        user_id: user.id,
        category: {
          category_name: categoryName.trim(),
          category_color: selectedColor,
        },
      }

      const response = await api.post("/categories/register/", body, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      const data = response.data

      const formatted = {
        id: data.category_id,
        label: data.category_name,
        color: data.category_color,
      }

      setCategories((prev) => [...prev, formatted])

      // reset
      setCategoryName("")
      setSelectedColor(colorOptions[0])
      setModalVisible(false)
    } catch (error) {
      console.error("Erro ao criar categoria:", error)
    }
  }

  async function handleDeleteCategory() {
    try {
      const token = await AsyncStorage.getItem("@token")

      if (!token || !user?.id) return

      const response = await api.delete(
        `/categories/delete/?category_id=${selectedCategory?.id}&user_id=${user?.id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      )

      setCategories((prev) =>
        prev.filter((category) => category.id !== selectedCategory?.id),
      )
    } catch (error) {
      console.error("Error ao deletar categoria:", error)
    }
  }

  async function handleEditCategory() {
    try {
      const token = await AsyncStorage.getItem("@token")

      if (!token || !user?.id) return

      const bodyData = {
        user_id: user?.id,
        category_id: selectedCategory?.id,
        category: {
          category_name: editCategoryName,
          category_color: editSelectedColor,
        },
      }

      const response = await api.patch("/categories/update/", bodyData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      const updatedCategory = response.data
      const formatted = {
        id: updatedCategory.category_id,
        label: updatedCategory.category_name,
        color: updatedCategory.category_color,
      }

      setCategories((prev) =>
        prev.map((category) =>
          category.id === formatted.id ? formatted : category,
        ),
      )

      setEditModalVisible(false)
    } catch (error) {
      console.log("Erro ao editar categoria:", error)
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

        const response = await api.get(`/categories/all/?user_id=${user?.id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

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
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return <Redirect href="/signin" />
  }

  return (
    <View className="flex-1 bg-background p-5 gap-5">
      <Text className="text-2xl text-white font-bold">Buscar categorias:</Text>

      <View className="relative">
        <TextInput
          className="bg-white rounded-lg p-5 pr-12"
          placeholder="Digite a categoria..."
          value={search}
          onChangeText={setSearch}
          onFocus={() => setSelectedCategory(null)}
        />

        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
          >
            <X size={20} color="#235347" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        ListEmptyComponent={() => (
          <View className="items-center justify-center mt-2">
            <Text className="text-gray-300 text-lg">
              Nenhuma categoria encontrada
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row gap-2 items-center"
            activeOpacity={1}
            onPress={() => {
              setSelectedCategory(item)
            }}
          >
            <View
              className="w-10 h-10 rounded-full border border-lightBorder items-center justify-center"
              style={{ backgroundColor: item.color }}
            >
              {selectedCategory?.label === item.label ? (
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
            {/* Editar categoria */}
            <TouchableOpacity
              className="p-3 bg-menuColor rounded-full"
              onPress={() => {
                setEditCategoryName(selectedCategory.label)
                setEditSelectedColor(selectedCategory.color)
                setEditModalVisible(true)
              }}
            >
              <Pencil size={20} color={"#f5f5f5"} />
            </TouchableOpacity>

            {/* Deletar categoria */}
            <TouchableOpacity
              className="p-3 bg-menuColor rounded-full"
              onPress={handleDeleteCategory}
            >
              <Trash size={20} color={"#f5f5f5"} />
            </TouchableOpacity>

            {/* Desselecionar categoria */}
            <TouchableOpacity
              className="p-3 bg-menuColor rounded-full"
              onPress={() => {
                setSelectedCategory(null)
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

      {/* Modal para criar categoria */}
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

      {/* Modal para editar categoria */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPressOut={() => setEditModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} className="w-[90%]">
            <View className="bg-card p-5 rounded-2xl gap-4">
              <Text className="text-white text-xl font-bold">
                Editar Categoria
              </Text>

              {/* Input nome */}
              <TextInput
                placeholder="Nome da categoria"
                value={editCategoryName}
                onChangeText={setEditCategoryName}
                className="bg-white rounded-lg p-3"
              />

              {/* Preview da cor */}
              <View className="flex-row items-center gap-2">
                <View
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: editSelectedColor }}
                />
                <Text className="text-white">Cor selecionada</Text>
              </View>

              {/* Seletor de cores */}
              <Text className="text-white">Selecione uma cor:</Text>
              <View className="flex-row flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setEditSelectedColor(color)}
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      editSelectedColor === color ? "border-2 border-white" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {editSelectedColor === color && (
                      <View className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Botões */}
              <View className="flex-row items-center justify-end gap-3 mt-3">
                <TouchableOpacity
                  onPress={() => {
                    setEditModalVisible(false)
                    setEditCategoryName("")
                  }}
                >
                  <Text className="text-white">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`px-4 py-2 rounded-lg ${
                    editCategoryName.trim() ? "bg-accent" : "bg-gray-400"
                  }`}
                  disabled={!editCategoryName.trim()}
                  onPress={handleEditCategory}
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

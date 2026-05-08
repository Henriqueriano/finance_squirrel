import { colorOptions } from "@/src/constants/categories-colors"
import { useAuth } from "@/src/hooks/use-auth"
import { useTheme } from "@/src/hooks/use-theme"
import { api } from "@/src/services/api"
import { Category } from "@/src/types/category/types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Redirect } from "expo-router"
import { Pencil, Plus, Trash, X } from "lucide-react-native"
import React, { useEffect, useMemo, useState } from "react"
import {
  FlatList,
  Modal,
  StyleSheet,
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
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  // Modal para criar categoria
  const [categoryName, setCategoryName] = useState("")
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [modalVisible, setModalVisible] = useState(false)
  // Modal para atualizar categoria
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editSelectedColor, setEditSelectedColor] = useState("")
  const [editModalVisible, setEditModalVisible] = useState(false)

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
        navigationColor: {
          backgroundColor: colors.navigatorColor,
        },
        btn: {
          backgroundColor: colors.btn,
        },
      }),
    [colors],
  )

  async function handleAddCategory() {
    try {
      if (!categoryName.trim()) return

      const token = await AsyncStorage.getItem("@token")

      if (!token || !user?.id) return

      const body = {
        name: categoryName.trim(),
        color: selectedColor,
      }

      const response = await api.post("/categories/", body, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      const data = response.data

      setCategories((prev) => [...prev, data])

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

      const response = await api.delete(`/categories/${selectedCategory?.id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

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
        name: editCategoryName,
        color: editSelectedColor,
      }

      const response = await api.patch(
        `/categories/${selectedCategory?.id}`,
        bodyData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      )

      const updatedCategory = response.data

      setCategories((prev) =>
        prev.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category,
        ),
      )

      setEditModalVisible(false)
    } catch (error) {
      console.log("Erro ao editar categoria:", error)
    }
  }

  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  )

  useEffect(() => {
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
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return <Redirect href="/signin" />
  }

  return (
    <View className="flex-1 p-2 gap-5" style={styles.container}>
      <Text className="text-2xl font-bold mt-2" style={styles.text}>
        Buscar categorias:
      </Text>

      {/* Barra de Pesquisa */}
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
            <X size={20} color={colors.icon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categorias */}
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
              className="w-10 h-10 rounded-full border items-center justify-center"
              style={{
                backgroundColor: item.color,
                borderColor: colors.border,
              }}
            >
              {selectedCategory?.name === item.name ? (
                <View
                  className="h-4 w-4 rounded-xl"
                  style={{ backgroundColor: colors.text }}
                />
              ) : (
                <View />
              )}
            </View>
            <Text className="text-xl" style={styles.text}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Btn Nova categoria */}
      <View className="absolute bottom-2 right-2 gap-2">
        {selectedCategory && (
          <View className="flex-row gap-2 justify-end">
            {/* Editar categoria */}
            <TouchableOpacity
              className="p-3 rounded-full"
              style={styles.navigationColor}
              onPress={() => {
                setEditCategoryName(selectedCategory.name)
                setEditSelectedColor(selectedCategory.color)
                setEditModalVisible(true)
              }}
            >
              <Pencil size={20} color={colors.text} />
            </TouchableOpacity>

            {/* Deletar categoria */}
            <TouchableOpacity
              className="p-3 rounded-full"
              style={styles.navigationColor}
              onPress={handleDeleteCategory}
            >
              <Trash size={20} color={colors.text} />
            </TouchableOpacity>

            {/* Desselecionar categoria */}
            <TouchableOpacity
              className="p-3 rounded-full"
              style={styles.navigationColor}
              onPress={() => {
                setSelectedCategory(null)
              }}
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          className="flex-row items-center p-2 rounded-lg gap-2"
          onPress={() => setModalVisible(true)}
          style={styles.btn}
        >
          <Text style={styles.text}>Nova Categoria</Text>
          <Plus size={30} color={colors.icon} />
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
            <View className="p-5 rounded-2xl gap-4" style={styles.card}>
              <Text className="text-xl font-bold" style={styles.text}>
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
                <Text style={styles.text}>Cor selecionada</Text>
              </View>

              {/* Seletor de cores */}
              <Text style={styles.text}>Selecione uma cor:</Text>
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
                  <Text style={styles.text}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`px-4 py-2 rounded-lg ${
                    categoryName.trim() ? "bg-accent" : "bg-gray-400"
                  }`}
                  disabled={!categoryName.trim()}
                  onPress={handleAddCategory}
                >
                  <Text style={styles.text}>Salvar</Text>
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
            <View className="p-5 rounded-2xl gap-4" style={styles.card}>
              <Text className="text-xl font-bold" style={styles.text}>
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
                <Text style={styles.text}>Cor selecionada</Text>
              </View>

              {/* Seletor de cores */}
              <Text style={styles.text}>Selecione uma cor:</Text>
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
                  <Text style={styles.text}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`px-4 py-2 rounded-lg ${
                    editCategoryName.trim() ? "bg-accent" : "bg-gray-400"
                  }`}
                  disabled={!editCategoryName.trim()}
                  onPress={handleEditCategory}
                >
                  <Text style={styles.text}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

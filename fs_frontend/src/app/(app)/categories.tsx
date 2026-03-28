import Entypo from "@expo/vector-icons/Entypo"
import React, { useState } from "react"
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native"

type Category = {
  id: string
  label: string
  color: string
}

export default function CategoriesScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#f87171")
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", color: "#fb923c", label: "Moradia"},
    { id: "2", color: "#c084fc", label: "Alimentação"},
    { id: "3", color: "#818cf8", label: "Lazer"},
    { id: "4", color: "#38bdf8", label: "Transporte"},
    { id: "5", color: "#22c55e", label: "Investimentos"},
    { id: "6", color: "#f87171", label: "Mercado"},
  ])

  const colorOptions = [
    "#f87171", "#fb923c", "#facc15",
    "#4ade80", "#22c55e", "#2dd4bf",
    "#38bdf8", "#60a5fa", "#818cf8",
    "#c084fc", "#e879f9", "#f472b6"
  ]

  function handleAddCategory() {
    const newCategory = {
      id: Date.now().toString(),
      label: categoryName.trim(),
      color: selectedColor,
    }

    setCategories((prev) => [...prev, newCategory])

    // reset
    setCategoryName("")
    setSelectedColor("#f87171")
    setModalVisible(false)
  }

  const filteredCategories = categories.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )

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
          <View className="flex-row gap-2 items-center">
            <View
              className="w-10 h-10 rounded-lg border border-lightBorder"
              style={{ backgroundColor: item.color }}
            />
            <Text className="text-white text-xl">
              {item.label}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity 
        className="flex-row items-center bg-accent px-4 py-3 rounded-lg absolute bottom-5 right-5"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white">Nova Categoria</Text>
        <Entypo name="plus" size={30} color="#235347" />
      </TouchableOpacity>

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
                <Text className="text-white">
                  Cor selecionada
                </Text>
              </View>

              {/* Seletor de cores */}
              <Text className="text-white">
                Selecione uma cor:
              </Text>

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
                    setModalVisible(false);
                    setCategoryName("");
                  }}
                >
                  <Text className="text-white">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`px-4 py-2 rounded-lg ${
                    categoryName.trim()
                      ? "bg-accent"
                      : "bg-gray-400"
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
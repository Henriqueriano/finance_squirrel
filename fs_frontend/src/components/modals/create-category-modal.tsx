import { colorOptions } from "@/src/constants/categories-colors"
import { useTheme } from "@/src/hooks/use-theme"
import { useMemo } from "react"
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

interface CreateCategoryModalInterface {
  categoryName: string
  setCategoryName: (text: string) => void
  selectedColor: string
  setSelectedColor: (text: string) => void
  modalVisible: boolean
  setModalVisible: (value: boolean) => void
  handleAddCategory: () => void
}

export default function CreateCategoryModal({
  categoryName,
  setCategoryName,
  selectedColor,
  setSelectedColor,
  modalVisible,
  setModalVisible,
  handleAddCategory,
}: CreateCategoryModalInterface) {
  const { colors } = useTheme()
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
        },
        text: {
          color: colors.text,
        },
        btn: {
          backgroundColor: colors.btn,
        },
      }),
    [colors],
  )

  return (
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
  )
}

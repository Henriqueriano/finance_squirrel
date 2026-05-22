import { loadApiURL } from "@/src/services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Link } from "expo-router"
import { useState } from "react"
import { Button, Text, TextInput, View } from "react-native"

export default function ConfigRoute() {
  const [url, setUrl] = useState("")

  async function handleSave() {
    await AsyncStorage.setItem("@api_url", url)

    await loadApiURL()

    alert("URL atualizada")
  }

  return (
    <View className="flex-1 items-center justify-center">
      <TextInput
        placeholder="http://192.168.0.10:8000"
        value={url}
        onChangeText={setUrl}
      />

      <Button title="Salvar URL" onPress={handleSave} />
      <Link href="/signin">
        <View className="p-3">
          <Text className="text-xl">Voltar</Text>
        </View>
      </Link>
    </View>
  )
}

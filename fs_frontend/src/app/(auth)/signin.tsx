import { useRouter } from "expo-router"
import { Button, Text, View } from "react-native"

export default function SignIn() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ textAlign: "center" }}>Tela de Login</Text>
      <Button title="Ir para Cadastro" onPress={() => router.push("/signup")} />
    </View>
  )
}

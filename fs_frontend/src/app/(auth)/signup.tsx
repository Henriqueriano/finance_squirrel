import { useRouter } from "expo-router"
import { Button, Text, View } from "react-native"

export default function SignUp() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ textAlign: "center" }}>Tela de Cadastro</Text>
      <Button title="Ir para login" onPress={() => router.push("/signin")} />
    </View>
  )
}

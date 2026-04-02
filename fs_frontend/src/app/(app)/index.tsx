import { useAuth } from "@/src/hooks/use-auth"
import { Link, useRouter } from "expo-router"
import { Text, View } from "react-native"

export default function Index() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="text-4xl text-white">
        Tela de Dash Board - {user?.name}
      </Text>

      <Link href="/signin">
        <Text className="text-2xl text-accent">Voltar para o Login</Text>
      </Link>
    </View>
  )
}

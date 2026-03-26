import { Link, useRouter } from "expo-router"
import { Text, View } from "react-native"


export default function Index(){
  const router = useRouter()

  return (
    <View className="flex-1 justify-center items-center p-10 bg-background">
      <Text className="text-4xl">Tela de Dash Board</Text>
      <Link href="/signin">
        <Text className="text-2xl">Voltar para o Login</Text>
      </Link>
    </View>
  )
}
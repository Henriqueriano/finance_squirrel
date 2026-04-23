import { PasswordInput } from "@/src/components/password-input"
import { useAuth } from "@/src/hooks/use-auth"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [msgError, setMsgError] = useState("")
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      setLoading(true)
      setMsgError("")

      if (!email || !password) {
        throw new Error("Preencha todos os campos")
      }

      await signIn(email, password)

      router.replace("/")
    } catch (err: any) {
      if (err instanceof Error) {
        setMsgError(err.message)
      } else {
        setMsgError("Erro ao criar conta")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient
      className="flex-1 justify-center p-5"
      colors={["#051F20", "#0B2B26", "#163832", "#235347"]}
      locations={[0, 0.25, 0.5, 0.75]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text className="text-6xl text-white leading-normal font-bold">
        Login
      </Text>

      <View className="flex-row gap-1">
        <Text className="text-white text-xl">Ainda não tem uma Conta?</Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-accent text-xl">Criar uma conta</Text>
        </TouchableOpacity>
      </View>

      <View className="justify-center items-center p-5">
        {msgError ? (
          <Text className="text-red-500 text-xl">{msgError}</Text>
        ) : null}
      </View>

      <View className="gap-5">
        <TextInput
          placeholder="Email"
          placeholderTextColor={"#fff"}
          className="p-5 w-auto text-white bg-accent border-lightBorder border-2 rounded-lg text-xl"
          value={email}
          onChangeText={setEmail}
        />
        <PasswordInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View className="flex-row justify-between items-center mt-10">
        <Text className="text-xl text-accent">Esqueci a senha</Text>
        <TouchableOpacity
          className="flex-row gap-5 bg-menuColor w-30 h-30 p-5 rounded-3xl items-center justify-center"
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text className="text-white text-xl">Login</Text>
              <MaterialCommunityIcons name="login" size={24} color="#8EB69B" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

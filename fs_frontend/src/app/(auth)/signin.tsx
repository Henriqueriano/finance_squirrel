import { PasswordInput } from "@/src/components/password-input"
import { useAuth } from "@/src/hooks/use-auth"
import { useTheme } from "@/src/hooks/use-theme"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { LogIn } from "lucide-react-native"
import { useState } from "react"
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

export default function SignIn() {
  const { colors } = useTheme()
  const [email, setEmail] = useState("lucas@email")
  const [password, setPassword] = useState("123")
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
      colors={colors.gradient}
      locations={[0, 0.25, 0.5, 0.75]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text
        className="text-6xl leading-normal font-bold"
        style={{ color: colors.text }}
      >
        Login
      </Text>

      <View className="flex-row gap-1">
        <Text className="text-xl" style={{ color: colors.text }}>
          Ainda não tem uma Conta?
        </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-xl" style={{ color: colors.anchor }}>
            Criar uma conta
          </Text>
        </TouchableOpacity>
      </View>

      <View className="justify-center items-center p-5">
        {msgError ? (
          <Text className="text-red-400 text-xl">{msgError}</Text>
        ) : null}
      </View>

      <View className="gap-5">
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.text}
          className="p-5 w-auto border-2 rounded-lg text-xl"
          style={{
            color: colors.text,
            backgroundColor: colors.accent,
            borderColor: colors.border,
          }}
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
        <Text className="text-xl" style={{ color: colors.anchor }}>
          Esqueci a senha
        </Text>
        <TouchableOpacity
          className="flex-row gap-5 w-30 h-30 p-5 rounded-3xl items-center justify-center"
          onPress={handleSignIn}
          disabled={loading}
          style={{ backgroundColor: colors.navigatorColor }}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <>
              <Text className="text-xl" style={{ color: colors.text }}>
                Login
              </Text>
              <LogIn size={24} color={colors.text} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

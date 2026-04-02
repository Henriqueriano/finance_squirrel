import { PasswordInput } from "@/src/components/password-input"
import { useAuth } from "@/src/hooks/use-auth"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSignUp = async () => {
    try {
      setLoading(true)
      setError("")

      // validações básicas
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Preencha todos os campos")
      }

      if (password !== confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      await signUp(name.trim(), email.trim(), password)

      // redireciona após sucesso
      router.replace("/signin")
    } catch (err) {
      console.error(err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Erro ao criar conta")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <LinearGradient
        className="flex-1 justify-center p-5"
        colors={["#051F20", "#0B2B26", "#163832", "#235347"]}
        locations={[0, 0.25, 0.5, 0.75]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text className="text-5xl text-white font-bold">Criar uma conta</Text>

        <View className="flex-row gap-1 mt-5">
          <Text className="text-white text-xl">Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.push("/signin")}>
            <Text className="text-accent text-xl">Fazer login</Text>
          </TouchableOpacity>
        </View>

        <View className="gap-5 mt-10">
          <TextInput
            placeholder="Nome de usuário"
            placeholderTextColor={"#fff"}
            className="p-5 text-white bg-accent border-lightBorder border-2 rounded-lg text-xl"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={"#fff"}
            className="p-5 text-white bg-accent border-lightBorder border-2 rounded-lg text-xl"
            value={email}
            onChangeText={setEmail}
          />
          <PasswordInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
          />
          <PasswordInput
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {error ? (
          <Text className="text-red-500 mt-3 text-lg">{error}</Text>
        ) : null}

        <View className="flex-row justify-end mt-10 items-center">
          <TouchableOpacity
            className="flex-row gap-5 bg-menuColor w-50 p-5 rounded-3xl items-center justify-center"
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text className="text-white text-xl">
              {loading ? "Criando..." : "Criar conta"}
            </Text>

            {!loading && (
              <MaterialCommunityIcons name="login" size={24} color="#8EB69B" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAwareScrollView>
  )
}

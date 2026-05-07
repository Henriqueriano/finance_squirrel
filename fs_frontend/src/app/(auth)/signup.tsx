import { PasswordInput } from "@/src/components/password-input"
import { useAuth } from "@/src/hooks/use-auth"
import { useTheme } from "@/src/hooks/use-theme"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { LogIn } from "lucide-react-native"
import { useMemo, useState } from "react"
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

export default function SignUp() {
  const { signUp } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const { colors } = useTheme()
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.background,
        },
        input: {
          color: colors.text,
          backgroundColor: colors.accent,
          borderColor: colors.border,
        },
        text: {
          color: colors.text,
        },
        anchor: {
          color: colors.anchor,
        },
        navigatorColor: {
          backgroundColor: colors.navigatorColor,
        },
      }),
    [colors],
  )

  const handleSignUp = async () => {
    try {
      setLoading(true)
      setError("")

      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Preencha todos os campos")
      }

      if (password !== confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      await signUp(name.trim(), email.trim(), password)

      // redireciona após sucesso
      router.replace("/")
    } catch (err) {
      console.error("Erro no registro:", err)

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
        colors={colors.gradient}
        locations={[0, 0.25, 0.5, 0.75]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text className="text-5xl font-bold" style={styles.text}>
          Criar uma conta
        </Text>

        <View className="flex-row gap-1 mt-5">
          <Text className="text-xl" style={styles.text}>
            Já tem uma conta?
          </Text>
          <TouchableOpacity onPress={() => router.push("/signin")}>
            <Text className="text-xl" style={styles.anchor}>
              Fazer login
            </Text>
          </TouchableOpacity>
        </View>

        <View className="gap-5 mt-10">
          <TextInput
            placeholder="Nome de usuário"
            placeholderTextColor={colors.text}
            className="p-5 border-2 rounded-lg text-xl"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.text}
            className="p-5 border-2 rounded-lg text-xl"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
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
            className="flex-row gap-5 w-50 p-5 rounded-3xl items-center justify-center"
            onPress={handleSignUp}
            disabled={loading}
            style={styles.navigatorColor}
          >
            <Text className="text-xl" style={styles.text}>
              {loading ? "Criando..." : "Criar conta"}
            </Text>

            {!loading && <LogIn size={24} color={colors.text} />}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAwareScrollView>
  )
}

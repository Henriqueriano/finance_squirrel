import { useRouter } from "expo-router"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

export default function SignIn() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#051F20"}}>
      <Text style={{ fontSize: 48,  color: "#fff" }}>Login</Text>
      <View style={{ flexDirection: "row", gap: 5, marginTop: 15}}>
        <Text style={{ color: "#fff"}}>Ainda não tem uma Conta?</Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={{color: "#8EB69B"}}>Criar uma conta</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginVertical: 40}}>
        <TextInput placeholder="Email" style={{ 
          padding: 10, 
          width: "auto", 
          borderColor: "#DAF1DE", 
          backgroundColor: "#8EB69B",
          borderRadius: 10,
          borderWidth: 2,
          color: "#fff"
        }}/>
        <TextInput placeholder="Senha" style={{ 
          padding: 10, 
          width: "auto", 
          borderColor: "#DAF1DE", 
          backgroundColor: "#8EB69B",
          borderRadius: 10,
          borderWidth: 2,
          color: "#fff",
          marginTop: 20
        }}/>
      </View>
      <View>
        <Text>Esqueci a senha</Text>
        <TouchableOpacity>
          <Text style={{ color: "#fff"}}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

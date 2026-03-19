import { PasswordInput } from '@/src/components/password-input';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <LinearGradient className="flex-1 justify-center p-5"
      colors={['#051F20', '#0B2B26', '#163832', '#235347']}
      locations={[0, 0.25, 0.5, 0.75]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text className="text-6xl text-textPrimary leading-normal font-bold">Login</Text>

      <View className="flex-row gap-1 mt-5">
        <Text className="text-textPrimary text-xl">Ainda não tem uma Conta?</Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-accent text-xl">Criar uma conta</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-5 mt-10">
        <TextInput placeholder="Email" placeholderTextColor={"#fff"} className="p-5 w-auto text-textPrimary bg-accent border-lightBorder border-2 rounded-lg text-xl" />
        <PasswordInput placeholder="Senha" value={password} onChangeText={setPassword} />
      </View>

      <View className="flex-row justify-between mt-10 items-center">
        <Text className="text-xl text-accent">Esqueci a senha</Text>
        <TouchableOpacity className="flex-row gap-5 bg-menuColor w-30 h-30 p-5 rounded-3xl" onPress={() => router.replace("/")}>
          <Text className="text-textPrimary text-center text-xl">Login</Text>
          <MaterialCommunityIcons name="login" size={24} color="#8EB69B" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

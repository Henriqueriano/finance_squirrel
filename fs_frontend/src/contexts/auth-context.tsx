import AsyncStorage from "@react-native-async-storage/async-storage"
import { AxiosError } from "axios"
import { createContext, ReactNode, useState } from "react"
import { api } from "../services/api"
import { AuthContextData, User } from "../types/authentication/types"

export const AuthContext = createContext<AuthContextData | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post("/auth/login/", {
        user_login: email,
        user_password: password,
      })
      const data = response.data

      const userData = {
        id: data?.id,
        name: data?.user_name,
        email: email,
      }
      const userToken = data.auth
      const cleanToken = userToken.replace(/^Bearer\s+/i, "")
      await AsyncStorage.setItem("token", cleanToken)

      setUser(userData)
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 501) {
          throw new Error("Email ou senha inválidos")
        }
      }

      console.error("Erro ao fazer login:", e)
      throw e
    }
  }

  async function signUp(name: string, email: string, password: string) {
    try {
      const bodyData = {
        user_name: name,
        user_login: email,
        user_password: password,
      }
      const response = await api.post("/auth/register/", bodyData)
      const data = response.data

      const userData = {
        id: data?.id,
        name: data?.user_name,
        email,
      }

      const userToken = data.auth
      const cleanToken = userToken.replace(/^Bearer\s+/i, "")
      await AsyncStorage.setItem("token", cleanToken)

      setUser(userData)
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error("Erro da API:", e.response?.data || e.message)
      } else {
        console.error("Erro inesperado:", e)
      }

      throw e
    }
  }

  function signOut() {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

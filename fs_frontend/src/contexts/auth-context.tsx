import { createContext, ReactNode, useState } from "react"
import { api } from "../services/api"
import { AuthContextData, User } from "../types/authentication/types"

// Criação do contexto
export const AuthContext = createContext<AuthContextData | undefined>(undefined)

// Tipagem do provider
type AuthProviderProps = {
  children: ReactNode
}

// Provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user

  // Função de login (mock básico)
  async function signIn(email: string, password: string) {
    try {
      const response = await api.get("/user")
      const data = response.data

      const myUser = data.find((user: any) => user.email === email.trim())

      if (!myUser) {
        throw new Error("Usuário não existe")
      }

      if (myUser.password !== password) {
        throw new Error("Email ou senha inválido")
      }

      setUser(myUser)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async function signUp(name: string, email: string, password: string) {
    try {
      const data = {
        name,
        email,
        password,
      }

      const response = await api.post("/user", data)
      console.log(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  // Logout
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

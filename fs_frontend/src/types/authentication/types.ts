// Tipagem dos dados do usuário autenticado
export type User = {
  id: string
  name: string
  email: string
}

// Tipagem do contexto
export type AuthContextData = {
  user: User | null
  isAuthenticated: boolean

  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
}

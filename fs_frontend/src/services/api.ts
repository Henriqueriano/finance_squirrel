import axios from "axios"

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000, // tempo máximo da requisição (10s)
  headers: {
    "Content-Type": "application/json",
  },
})

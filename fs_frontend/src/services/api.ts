import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

const DEFAULT_API_URL = process.env.EXPO_PUBLIC_API_BASE_URL

export const api = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function loadApiURL() {
  const savedUrl = await AsyncStorage.getItem("@api_url")

  api.defaults.baseURL = savedUrl || DEFAULT_API_URL
}

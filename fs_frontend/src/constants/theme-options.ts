import { LeafyGreen, Moon, SunMedium } from "lucide-react-native"
import { ThemeOption } from "../types/themes/types"

export const themesOptions: ThemeOption[] = [
  {
    key: "claro",
    label: "claro",
    icon: SunMedium,
  },
  {
    key: "escuro",
    label: "escuro",
    icon: Moon,
  },
  {
    key: "verde",
    label: "verde",
    icon: LeafyGreen,
  },
]

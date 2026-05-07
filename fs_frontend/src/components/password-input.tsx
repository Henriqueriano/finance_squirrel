import { Eye, EyeOff } from "lucide-react-native"
import { useState } from "react"
import { TextInput, TouchableOpacity, View } from "react-native"
import { useTheme } from "../hooks/use-theme"

type Props = {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
}

export function PasswordInput({ placeholder, value, onChangeText }: Props) {
  const { colors } = useTheme()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View
      className="flex-row items-center border-2 rounded-lg"
      style={{ backgroundColor: colors.accent, borderColor: colors.border }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        secureTextEntry={!showPassword}
        style={{ color: colors.text, backgroundColor: colors.accent }}
        className="flex-1 p-5 text-xl rounded-lg"
      />

      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        className="pr-4"
      >
        {showPassword ? (
          <EyeOff size={22} color={colors.text} />
        ) : (
          <Eye size={22} color={colors.text} />
        )}
      </TouchableOpacity>
    </View>
  )
}

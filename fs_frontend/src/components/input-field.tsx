import { ReactNode } from "react"
import { Text, TextInput, TextInputProps, View } from "react-native"
import { useTheme } from "../hooks/use-theme"

type InputFieldProps = {
  label: string
  leftElement?: ReactNode
} & TextInputProps

export function InputField({ label, leftElement, ...rest }: InputFieldProps) {
  const { colors } = useTheme()
  return (
    <View className="flex-row items-center gap-3">
      <Text className="w-24" style={{ color: colors.text }}>
        {label}
      </Text>

      <View className="flex-1 flex-row items-center bg-white rounded-lg px-3">
        {leftElement && <View className="mr-2">{leftElement}</View>}

        <TextInput className="flex-1 py-2 text-black" {...rest} />
      </View>
    </View>
  )
}

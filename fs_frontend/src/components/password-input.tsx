import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export function PasswordInput({
  placeholder,
  value,
  onChangeText
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-row items-center bg-accent border-lightBorder border-2 rounded-lg">
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#fff"
        secureTextEntry={!showPassword}
        className="flex-1 p-5 text-textPrimary text-xl"
      />

      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        className="pr-4"
      >
        <Ionicons
          name={showPassword ? "eye-off" : "eye"}
          size={22}
          color="white"
        />
      </TouchableOpacity>

    </View>
  );
}
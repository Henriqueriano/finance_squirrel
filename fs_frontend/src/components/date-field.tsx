import DateTimePicker from "@react-native-community/datetimepicker"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { InputField } from "./input-field"

type DateFieldProps = {
  value: Date | null
  onChange: (date: Date | null) => void
}

export function DateField({ value, onChange }: DateFieldProps) {
  const [show, setShow] = useState(false)

  function handleChange(event: any, selectedDate?: Date) {
    setShow(false)

    if (event.type === "set" && selectedDate) {
      onChange(selectedDate)
    }
  }

  function formatDate(date: Date | null) {
    if (!date) return ""
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <View className="gap-2">
      <TouchableOpacity onPress={() => setShow(true)}>
        <View pointerEvents="none">
          <InputField
            label="Data:"
            value={formatDate(value)}
            placeholder="Selecione uma data"
            editable={false}
          />
        </View>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  )
}

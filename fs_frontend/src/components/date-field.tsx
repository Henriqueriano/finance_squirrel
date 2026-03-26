import DateTimePicker from "@react-native-community/datetimepicker"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { InputField } from "./input-field"

export function DateField() {
  const [date, setDate] = useState<Date | null>(null)
  const [show, setShow] = useState(false)

  function handleChange(event: any, selectedDate?: Date) {
    setShow(false)
    if (selectedDate) {
      setDate(selectedDate)
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
            value={formatDate(date)}
            placeholder="Selecione uma data"
            editable={false}
          />
        </View>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  )
}
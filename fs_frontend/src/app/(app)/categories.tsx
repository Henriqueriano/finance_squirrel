import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
export default function CategoriesScreen() {
  return (
    <View className="flex-1 bg-background p-5">
      <Text className="text-2xl text-textPrimary font-bold mb-5">Buscar categorias:</Text>

      <TextInput className="bg-white rounded-xl p-5 mb-5" placeholder="Buscar..." />

      <View className="gap-5">
        <Text className="text-textPrimary text-xl">🟥 Moradia</Text>
        <Text className="text-textPrimary text-xl">🟦 Alimentação</Text>
        <Text className="text-textPrimary text-xl">🟩 Lazer</Text>
        <Text className="text-textPrimary text-xl">🟧 Transporte</Text>
        <Text className="text-textPrimary text-xl">🟪 Investimentos</Text>
      </View>

      <TouchableOpacity className="flex-row items-center gap-10 bg-accent p-4 rounded-xl absolute bottom-5 right-5">
        <Text className="text-textPrimary">Nova Categoria</Text>
        <Entypo name="plus" size={30} color="#235347" />
      </TouchableOpacity>
    </View>
  );
}
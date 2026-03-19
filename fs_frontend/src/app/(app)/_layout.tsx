import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
export default function TabLayout() {
  const router = useRouter()
  return (
    <Tabs screenOptions={{ 
      // Header (barra superior)
      headerStyle: {
        backgroundColor: '#163832', // fundo do header
      },
      headerTintColor: '#FFFFFF', // cor de ícones e botão back
      headerTitleStyle: {
        color: '#FFFFFF', // cor do título
        fontWeight: 'bold',
      }, 
      // Bottom (barra inferior)
      tabBarStyle: {
        backgroundColor: '#163832', // fundo da barra
        borderTopWidth: 0,          // remove borda
      },
      tabBarActiveTintColor: '#fff',   // ícone/texto ativo
      tabBarInactiveTintColor: '#8EB69B',    // ícone/texto inativo
    }}>
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "DashBoard",
          headerRight: () => (
            <TouchableOpacity className="mr-5" onPress={() => router.navigate("/settings")}>
              <FontAwesome name="gear" size={40} color="#8EB69B" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          href: null,
        }}
      />
    </Tabs>
  );
}

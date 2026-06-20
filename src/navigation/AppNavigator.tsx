import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import FormularioVistoriaScreen from '../screens/FormularioVistoriaScreen';
import DetalhesVistoriaScreen from '../screens/DetalhesVistoriaScreen';
import { signOut } from '../services/auth';

const Stack = createNativeStackNavigator<AppStackParamList>();

function BotaoSair() {
  return (
    <TouchableOpacity onPress={signOut} style={{ marginRight: 4 }}>
      <Text style={{ color: '#1a73e8', fontSize: 15 }}>Sair</Text>
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Vistorias', headerRight: () => <BotaoSair /> }}
      />
      <Stack.Screen
        name="FormularioVistoria"
        component={FormularioVistoriaScreen}
        options={{ title: 'Nova Vistoria' }}
      />
      <Stack.Screen
        name="DetalhesVistoria"
        component={DetalhesVistoriaScreen}
        options={{ title: 'Detalhes da Vistoria' }}
      />
    </Stack.Navigator>
  );
}

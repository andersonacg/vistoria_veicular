import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FormularioVistoriaScreen from '../screens/FormularioVistoriaScreen';
import DetalhesVistoriaScreen from '../screens/DetalhesVistoriaScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Vistorias' }} />
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
    </NavigationContainer>
  );
}

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../types';

type Props = {
  route: RouteProp<AppStackParamList, 'DetalhesVistoria'>;
};

export default function DetalhesVistoriaScreen({ route }: Props) {
  const { vistoriaId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.placeholder}>Detalhes da vistoria: {vistoriaId}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  placeholder: { fontSize: 16, color: '#888', marginTop: 40, textAlign: 'center' },
});

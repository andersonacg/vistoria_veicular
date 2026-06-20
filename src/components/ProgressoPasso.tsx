import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  passo: number;
  totalPassos: number;
  titulo: string;
}

export default function ProgressoPasso({ passo, totalPassos, titulo }: Props) {
  const progresso = passo / totalPassos;

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.contador}>{passo}/{totalPassos}</Text>
      </View>
      <View style={styles.trilha}>
        <View style={[styles.barra, { width: `${progresso * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, backgroundColor: '#fff' },
  topo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  titulo: { fontSize: 14, fontWeight: '600', color: '#333' },
  contador: { fontSize: 13, color: '#888' },
  trilha: { height: 4, backgroundColor: '#e0e0e0', borderRadius: 2 },
  barra: { height: 4, backgroundColor: '#1a73e8', borderRadius: 2 },
});

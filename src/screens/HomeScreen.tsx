import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, Vistoria } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParamList, 'Home'>;
};

const MOCK_VISTORIAS: Vistoria[] = [];

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_VISTORIAS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetalhesVistoria', { vistoriaId: item.id })}
          >
            <Text style={styles.placa}>{item.placa}</Text>
            <Text style={styles.modelo}>{item.modelo} — {item.ano}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma vistoria registrada.</Text>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('FormularioVistoria', {})}
      >
        <Text style={styles.fabTexto}>+ Nova Vistoria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  placa: { fontSize: 18, fontWeight: 'bold', color: '#1a73e8' },
  modelo: { fontSize: 14, color: '#555', marginTop: 4 },
  status: { fontSize: 12, color: '#888', marginTop: 4, textTransform: 'capitalize' },
  vazio: { textAlign: 'center', marginTop: 60, color: '#aaa', fontSize: 16 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#1a73e8',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 4,
  },
  fabTexto: { color: '#fff', fontWeight: '600', fontSize: 15 },
});

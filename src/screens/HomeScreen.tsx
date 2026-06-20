import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, Vistoria, ChecklistEstetica, ChecklistMecanica } from '../types';
import { useAuth } from '../context/AuthContext';
import { buscarVistorias } from '../services/vistorias';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParamList, 'Home'>;
};

function contarAvarias(estetica: ChecklistEstetica, mecanica: ChecklistMecanica): number {
  const vals = [...Object.values(estetica), ...Object.values(mecanica)];
  return vals.filter(v => v === 'avaria').length;
}

function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function CardVistoria({ item, onPress }: { item: Vistoria; onPress: () => void }) {
  const avarias = contarAvarias(item.checklist_estetica, item.checklist_mecanica);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardTopo}>
        <Text style={styles.placa}>{item.placa}</Text>
        <Text style={styles.data}>{formatarData(item.created_at)}</Text>
      </View>
      <Text style={styles.modelo}>{item.marca} {item.modelo} · {item.ano}</Text>
      <View style={styles.cardRodape}>
        <View style={styles.badgeConcluida}>
          <Text style={styles.badgeConcluidaTexto}>Concluída</Text>
        </View>
        {avarias > 0 && (
          <View style={styles.badgeAvaria}>
            <Text style={styles.badgeAvariaTexto}>
              ⚠ {avarias} {avarias === 1 ? 'avaria' : 'avarias'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const { session } = useAuth();
  const [vistorias, setVistorias] = useState<Vistoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!session?.user?.id) return;
    setCarregando(true);
    setErro(null);
    try {
      const lista = await buscarVistorias(session.user.id);
      setVistorias(lista);
    } catch (e: any) {
      setErro(e.message ?? 'Erro ao carregar vistorias.');
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id]);

  // Recarrega sempre que a tela recebe foco (ex: ao voltar do formulário)
  useFocusEffect(carregar);

  return (
    <View style={styles.container}>
      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#1a73e8" />
        </View>
      ) : erro ? (
        <View style={styles.centro}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.botaoTentar} onPress={carregar}>
            <Text style={styles.botaoTentarTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vistorias}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <CardVistoria
              item={item}
              onPress={() => navigation.navigate('DetalhesVistoria', { vistoriaId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centro}>
              <Text style={styles.vazioTexto}>Nenhuma vistoria registrada.</Text>
              <Text style={styles.vazioSub}>Toque em "+ Nova Vistoria" para começar.</Text>
            </View>
          }
          contentContainerStyle={vistorias.length === 0 ? styles.listaVazia : styles.lista}
          refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar} tintColor="#1a73e8" />}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('FormularioVistoria', {})}
        activeOpacity={0.85}
      >
        <Text style={styles.fabTexto}>+ Nova Vistoria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  lista: { padding: 12, paddingBottom: 96 },
  listaVazia: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },

  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  placa: { fontSize: 20, fontWeight: '800', color: '#1a73e8', letterSpacing: 1 },
  data: { fontSize: 12, color: '#999' },
  modelo: { fontSize: 14, color: '#555', marginBottom: 10 },

  cardRodape: { flexDirection: 'row', gap: 8 },
  badgeConcluida: {
    backgroundColor: '#f0faf2', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: '#34a853',
  },
  badgeConcluidaTexto: { fontSize: 11, color: '#34a853', fontWeight: '600' },
  badgeAvaria: {
    backgroundColor: '#fff8e1', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: '#f9a825',
  },
  badgeAvariaTexto: { fontSize: 11, color: '#7a5c00', fontWeight: '600' },

  vazioTexto: { fontSize: 16, color: '#aaa', marginBottom: 6 },
  vazioSub: { fontSize: 13, color: '#bbb', textAlign: 'center' },

  erroTexto: { fontSize: 14, color: '#ea4335', textAlign: 'center', marginBottom: 16 },
  botaoTentar: {
    backgroundColor: '#1a73e8', borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 20,
  },
  botaoTentarTexto: { color: '#fff', fontWeight: '600' },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#1a73e8',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#1a73e8',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

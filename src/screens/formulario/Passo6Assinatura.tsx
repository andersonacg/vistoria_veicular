import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PassoProps } from '../../types';
import ProgressoPasso from '../../components/ProgressoPasso';

export default function Passo6Assinatura({ onNext, onBack, passo, totalPassos }: PassoProps) {
  const ehUltimo = passo === totalPassos;
  return (
    <View style={styles.container}>
      <ProgressoPasso passo={passo} totalPassos={totalPassos} titulo="Assinatura Digital" />
      <View style={styles.corpo}>
        <Text style={styles.placeholder}>Assinatura Digital — em breve</Text>
      </View>
      <View style={styles.rodape}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={onBack}>
          <Text style={styles.botaoVoltarTexto}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoProximo} onPress={onNext}>
          <Text style={styles.botaoProximoTexto}>{ehUltimo ? 'Salvar' : 'Próximo'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  corpo: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  placeholder: { fontSize: 16, color: '#aaa', textAlign: 'center' },
  rodape: {
    flexDirection: 'row', gap: 12, padding: 16,
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  botaoVoltar: {
    flex: 1, padding: 14, borderRadius: 8,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  botaoVoltarTexto: { fontSize: 15, color: '#555' },
  botaoProximo: { flex: 2, padding: 14, borderRadius: 8, backgroundColor: '#1a73e8', alignItems: 'center' },
  botaoProximoTexto: { fontSize: 15, color: '#fff', fontWeight: '600' },
});

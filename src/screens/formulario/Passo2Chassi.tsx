import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView,
} from 'react-native';
import { PassoProps } from '../../types';
import ProgressoPasso from '../../components/ProgressoPasso';

const diagramaChassi = require('../../../assets/images/diagrama_localizacao_chassi.png');

export default function Passo2Chassi({ onNext, onBack, passo, totalPassos }: PassoProps) {
  return (
    <View style={styles.container}>
      <ProgressoPasso passo={passo} totalPassos={totalPassos} titulo="Foto do Chassi" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instrucao}>
          Localize o número do chassi em um dos pontos indicados abaixo e fotografe-o.
        </Text>

        <Image
          source={diagramaChassi}
          style={styles.imagem}
          resizeMode="contain"
        />

        <Text style={styles.dica}>
          💡 O chassi costuma estar gravado no para-brisa (canto inferior), no batente da porta do motorista ou no compartimento do motor.
        </Text>
      </ScrollView>

      <View style={styles.rodape}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={onBack}>
          <Text style={styles.botaoVoltarTexto}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoProximo} onPress={onNext}>
          <Text style={styles.botaoProximoTexto}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 8 },
  instrucao: {
    fontSize: 15, color: '#333', lineHeight: 22, marginBottom: 16,
  },
  imagem: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  dica: {
    fontSize: 13, color: '#666', lineHeight: 20,
    backgroundColor: '#f0f6ff', padding: 12, borderRadius: 8,
  },
  rodape: {
    flexDirection: 'row', gap: 12, padding: 16,
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  botaoVoltar: {
    flex: 1, padding: 14, borderRadius: 8,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  botaoVoltarTexto: { fontSize: 15, color: '#555' },
  botaoProximo: { flex: 2, padding: 14, borderRadius: 8, backgroundColor: '#1a73e8', alignItems: 'center' },
  botaoProximoTexto: { fontSize: 15, color: '#fff', fontWeight: '600' },
});

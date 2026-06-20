import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Alert, useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PassoProps, FotosVistoria } from '../../types';
import ProgressoPasso from '../../components/ProgressoPasso';

const FOTOS: { chave: keyof FotosVistoria; label: string }[] = [
  { chave: 'frente',           label: 'Frente' },
  { chave: 'traseira',         label: 'Traseira' },
  { chave: 'lateral_esquerda', label: 'Lat. Esquerda' },
  { chave: 'lateral_direita',  label: 'Lat. Direita' },
  { chave: 'motor',            label: 'Motor' },
];

async function abrirCamera(onCaptura: (uri: string) => void) {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permissão necessária', 'Permita o acesso à câmera nas configurações do dispositivo.');
    return;
  }
  const resultado = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
    allowsEditing: false,
  });
  if (!resultado.canceled && resultado.assets[0]) {
    onCaptura(resultado.assets[0].uri);
  }
}

interface MiniaturaProps {
  chave: keyof FotosVistoria;
  label: string;
  uri: string | null;
  largura: number;
  onPress: () => void;
}

function Miniatura({ label, uri, largura, onPress }: MiniaturaProps) {
  const altura = largura * 0.72;
  return (
    <TouchableOpacity
      style={[styles.miniatura, { width: largura, height: altura }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {uri ? (
        <>
          <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.miniaturaOverlay}>
            <Text style={styles.miniaturaRefazer}>↺ Refazer</Text>
          </View>
        </>
      ) : (
        <View style={styles.miniaturaVazia}>
          <Text style={styles.cameraIcone}>📷</Text>
          <Text style={styles.miniaturaLabel}>{label}</Text>
        </View>
      )}
      <View style={[styles.miniaturaBadge, uri ? styles.badgePreenchida : styles.badgeVazia]}>
        <Text style={styles.miniaturaBadgeTexto}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Passo5Fotos({ dados, atualizar, onNext, onBack, passo, totalPassos }: PassoProps) {
  const { width } = useWindowDimensions();
  const fotos = dados.fotos;

  // Duas colunas com gap
  const GAP = 12;
  const PADDING = 16;
  const larguraMiniatura = (width - PADDING * 2 - GAP) / 2;

  function capturar(chave: keyof FotosVistoria) {
    abrirCamera(uri => atualizar({ fotos: { ...fotos, [chave]: uri } }));
  }

  const totalPreenchidas = FOTOS.filter(f => fotos[f.chave] !== null).length;
  const podeProsseguir = totalPreenchidas === FOTOS.length;

  // Grade: 4 itens em 2 colunas + motor centralizado
  const pares = FOTOS.slice(0, 4);
  const ultima = FOTOS[4];

  return (
    <View style={styles.container}>
      <ProgressoPasso passo={passo} totalPassos={totalPassos} titulo="Fotos Obrigatórias" />

      <View style={styles.corpo}>
        <View style={styles.contadorRow}>
          <View style={styles.contadorBadge}>
            <Text style={styles.contadorTexto}>{totalPreenchidas}/{FOTOS.length} fotos</Text>
          </View>
        </View>

        {/* Grade 2×2 */}
        <View style={styles.grade}>
          {pares.map(f => (
            <Miniatura
              key={f.chave}
              chave={f.chave}
              label={f.label}
              uri={fotos[f.chave]}
              largura={larguraMiniatura}
              onPress={() => capturar(f.chave)}
            />
          ))}
        </View>

        {/* Motor centralizado */}
        <View style={styles.ultimaLinha}>
          <Miniatura
            chave={ultima.chave}
            label={ultima.label}
            uri={fotos[ultima.chave]}
            largura={larguraMiniatura}
            onPress={() => capturar(ultima.chave)}
          />
        </View>

        {!podeProsseguir && (
          <Text style={styles.dica}>
            Toque em cada quadro para fotografar o veículo nos ângulos indicados.
          </Text>
        )}
      </View>

      <View style={styles.rodape}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={onBack}>
          <Text style={styles.botaoVoltarTexto}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoProximo, !podeProsseguir && styles.botaoDesabilitado]}
          onPress={onNext}
          disabled={!podeProsseguir}
        >
          <Text style={styles.botaoProximoTexto}>
            {podeProsseguir ? 'Próximo' : `Faltam ${FOTOS.length - totalPreenchidas}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  corpo: { flex: 1, padding: 16 },

  contadorRow: { alignItems: 'flex-end', marginBottom: 10 },
  contadorBadge: {
    backgroundColor: '#e8f0fe', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  contadorTexto: { fontSize: 12, color: '#1a73e8', fontWeight: '600' },

  grade: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12,
  },

  ultimaLinha: { alignItems: 'center' },

  miniatura: {
    borderRadius: 10, overflow: 'hidden',
    backgroundColor: '#e8e8e8',
  },
  miniaturaVazia: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  cameraIcone: { fontSize: 28 },
  miniaturaLabel: { fontSize: 12, color: '#888', fontWeight: '500' },
  miniaturaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  miniaturaRefazer: { color: '#fff', fontSize: 13, fontWeight: '600' },
  miniaturaBadge: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingVertical: 4, alignItems: 'center',
  },
  badgePreenchida: { backgroundColor: 'rgba(26,115,232,0.85)' },
  badgeVazia: { backgroundColor: 'rgba(0,0,0,0.35)' },
  miniaturaBadgeTexto: { color: '#fff', fontSize: 11, fontWeight: '600' },

  dica: {
    marginTop: 12, fontSize: 13, color: '#888',
    textAlign: 'center', lineHeight: 19,
  },

  rodape: {
    flexDirection: 'row', gap: 12, padding: 16,
    borderTopWidth: 1, borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  botaoVoltar: {
    flex: 1, padding: 14, borderRadius: 8,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  botaoVoltarTexto: { fontSize: 15, color: '#555' },
  botaoProximo: { flex: 2, padding: 14, borderRadius: 8, backgroundColor: '#1a73e8', alignItems: 'center' },
  botaoDesabilitado: { backgroundColor: '#b0c8f5' },
  botaoProximoTexto: { fontSize: 15, color: '#fff', fontWeight: '600' },
});

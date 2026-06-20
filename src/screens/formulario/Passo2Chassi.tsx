import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, TextInput, Modal,
  Alert, useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PassoProps } from '../../types';
import ProgressoPasso from '../../components/ProgressoPasso';

const diagramaChassi = require('../../../assets/images/diagrama_localizacao_chassi.png');
const VIN_REGEX = /^[A-Z0-9]{17}$/;

async function abrirCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permissão necessária', 'Permita o acesso à câmera nas configurações do dispositivo.');
    return null;
  }
  const resultado = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
    allowsEditing: false,
  });
  if (!resultado.canceled && resultado.assets[0]) return resultado.assets[0].uri;
  return null;
}

export default function Passo2Chassi({ dados, atualizar, onNext, onBack, passo, totalPassos }: PassoProps) {
  const { width } = useWindowDimensions();
  const [erroVin, setErroVin] = useState<string | null>(null);
  const [diagramaAberto, setDiagramaAberto] = useState(false);

  const fotoChassi = dados.foto_chassi;
  const vin = dados.numero_chassi ?? '';
  const vinValido = VIN_REGEX.test(vin);
  const podeProsseguir = vinValido && fotoChassi !== null;

  const fotoLargura = width - 32;
  const fotoAltura = fotoLargura * 0.6;

  function onVinChange(texto: string) {
    const upper = texto.toUpperCase().replace(/[^A-Z0-9]/g, '');
    atualizar({ numero_chassi: upper });
    if (erroVin) setErroVin(null);
  }

  function onVinBlur() {
    if (vin.length > 0 && !vinValido) {
      setErroVin('O chassi deve ter exatamente 17 caracteres alfanuméricos.');
    } else {
      setErroVin(null);
    }
  }

  async function capturarFoto() {
    const uri = await abrirCamera();
    if (uri) atualizar({ foto_chassi: uri });
  }

  return (
    <View style={styles.container}>
      <ProgressoPasso passo={passo} totalPassos={totalPassos} titulo="Chassi do Veículo" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Diagrama com toque para ampliar */}
        <Text style={styles.label}>Localização do chassi</Text>
        <TouchableOpacity
          style={styles.diagramaWrapper}
          onPress={() => setDiagramaAberto(true)}
          activeOpacity={0.85}
        >
          <Image source={diagramaChassi} style={styles.diagramaImagem} resizeMode="contain" />
          <View style={styles.diagramaDica}>
            <Text style={styles.diagramaDicaTexto}>🔍 Toque para ampliar</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.dicaChassi}>
          💡 O chassi costuma estar gravado no para-brisa (canto inferior), no batente da porta do motorista ou no compartimento do motor.
        </Text>

        {/* Campo VIN */}
        <Text style={[styles.label, { marginTop: 20 }]}>Número do chassi (VIN)</Text>
        <TextInput
          style={[styles.vinInput, erroVin && styles.vinInputErro]}
          value={vin}
          onChangeText={onVinChange}
          onBlur={onVinBlur}
          placeholder="Ex: 9BWZZZ377VT004251"
          placeholderTextColor="#bbb"
          maxLength={17}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <View style={styles.vinRodape}>
          {erroVin ? (
            <Text style={styles.erroTexto}>{erroVin}</Text>
          ) : (
            <Text style={styles.vinDica}>Somente letras maiúsculas e números</Text>
          )}
          <Text style={[styles.vinContador, vin.length === 17 && styles.vinContadorOk]}>
            {vin.length}/17
          </Text>
        </View>

        {/* Foto do chassi */}
        <Text style={[styles.label, { marginTop: 20 }]}>Foto do chassi</Text>
        <TouchableOpacity
          style={[styles.fotoArea, { width: fotoLargura, height: fotoAltura }]}
          onPress={capturarFoto}
          activeOpacity={0.8}
        >
          {fotoChassi ? (
            <>
              <Image
                source={{ uri: fotoChassi }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
              <View style={styles.fotoOverlay}>
                <Text style={styles.fotoRefazer}>↺ Refazer foto</Text>
              </View>
            </>
          ) : (
            <View style={styles.fotoVazia}>
              <Text style={styles.cameraIcone}>📷</Text>
              <Text style={styles.fotoVaziaTexto}>Toque para fotografar o chassi</Text>
            </View>
          )}
        </TouchableOpacity>

      </ScrollView>

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
            {podeProsseguir ? 'Próximo' : !vinValido ? 'Informe o VIN' : 'Tire a foto'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de zoom do diagrama */}
      <Modal visible={diagramaAberto} animationType="fade" transparent statusBarTranslucent>
        <View style={styles.modalFundo}>
          <TouchableOpacity style={styles.modalFechar} onPress={() => setDiagramaAberto(false)}>
            <Text style={styles.modalFecharTexto}>✕ Fechar</Text>
          </TouchableOpacity>
          <ScrollView
            style={{ flex: 1 }}
            maximumZoomScale={4}
            minimumZoomScale={1}
            centerContent
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={diagramaChassi}
              style={{ width, height: width * 1.1 }}
              resizeMode="contain"
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 24 },

  label: { fontSize: 13, fontWeight: '700', color: '#444', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 },

  diagramaWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  diagramaImagem: { width: '100%', height: 200 },
  diagramaDica: {
    position: 'absolute', bottom: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  diagramaDicaTexto: { color: '#fff', fontSize: 12, fontWeight: '600' },

  dicaChassi: {
    fontSize: 13, color: '#666', lineHeight: 20,
    backgroundColor: '#f0f6ff', padding: 12, borderRadius: 8,
  },

  vinInput: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 8,
    padding: 12, fontSize: 18, fontWeight: '700',
    letterSpacing: 2, color: '#222',
    backgroundColor: '#fafafa',
  },
  vinInputErro: { borderColor: '#ea4335' },
  vinRodape: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  erroTexto: { fontSize: 12, color: '#ea4335', flex: 1 },
  vinDica: { fontSize: 12, color: '#999', flex: 1 },
  vinContador: { fontSize: 12, color: '#999', marginLeft: 8 },
  vinContadorOk: { color: '#34a853', fontWeight: '700' },

  fotoArea: {
    borderRadius: 10, overflow: 'hidden',
    backgroundColor: '#e8e8e8', alignSelf: 'center',
  },
  fotoVazia: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  cameraIcone: { fontSize: 36 },
  fotoVaziaTexto: { fontSize: 14, color: '#888', fontWeight: '500' },
  fotoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  fotoRefazer: { color: '#fff', fontSize: 15, fontWeight: '700' },

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
  botaoDesabilitado: { backgroundColor: '#b0c8f5' },
  botaoProximoTexto: { fontSize: 15, color: '#fff', fontWeight: '600' },

  modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)' },
  modalFechar: {
    padding: 16, paddingTop: 52, alignSelf: 'flex-end',
  },
  modalFecharTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

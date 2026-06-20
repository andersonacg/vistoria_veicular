import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import SignatureCanvas, { SignatureViewRef } from 'react-native-signature-canvas';
import { PassoProps } from '../../types';
import ProgressoPasso from '../../components/ProgressoPasso';

// Estilos injetados no canvas WebView
const webStyle = `
  .m-signature-pad {
    box-shadow: none;
    border: none;
    margin: 0;
  }
  .m-signature-pad--body {
    border: none;
    background: #fff;
  }
  .m-signature-pad--footer {
    display: none;
  }
  body { margin: 0; background: #fff; }
`;

export default function Passo6Assinatura({ dados, atualizar, onNext, onBack, passo, totalPassos }: PassoProps) {
  const ref = useRef<SignatureViewRef>(null);
  const [assinado, setAssinado] = useState(!!dados.assinatura);
  // Controla se o canvas está em modo de "prévia" (já confirmado) ou edição
  const [modoPrevia, setModoPrevia] = useState(!!dados.assinatura);

  function handleConfirmar() {
    ref.current?.readSignature();
  }

  function handleLimpar() {
    ref.current?.clearSignature();
    setAssinado(false);
    setModoPrevia(false);
    atualizar({ assinatura: null });
  }

  function handleRefazer() {
    setModoPrevia(false);
    setAssinado(false);
    atualizar({ assinatura: null });
  }

  function handleOK(base64: string) {
    atualizar({ assinatura: base64 });
    setAssinado(true);
    setModoPrevia(true);
  }

  function handleEmpty() {
    setAssinado(false);
  }

  return (
    <View style={styles.container}>
      <ProgressoPasso passo={passo} totalPassos={totalPassos} titulo="Assinatura Digital" />

      <View style={styles.corpo}>
        <Text style={styles.instrucao}>
          Assine abaixo com o dedo ou caneta. Esta é a assinatura do vistoriador responsável.
        </Text>

        <View style={styles.canvasWrapper}>
          {modoPrevia && dados.assinatura ? (
            // Prévia da assinatura confirmada
            <Image
              source={{ uri: dados.assinatura }}
              style={styles.previa}
              resizeMode="contain"
            />
          ) : (
            <SignatureCanvas
              ref={ref}
              onOK={handleOK}
              onEmpty={handleEmpty}
              webStyle={webStyle}
              penColor="#1a1a1a"
              minWidth={2}
              maxWidth={4}
              style={styles.canvas}
              scrollable={false}
            />
          )}

          <View style={styles.linhaGuia} pointerEvents="none" />
        </View>

        {modoPrevia ? (
          // Assinatura confirmada — opção de refazer
          <View style={styles.acoes}>
            <View style={styles.badgeConfirmado}>
              <Text style={styles.badgeConfirmadoTexto}>✓ Assinatura capturada</Text>
            </View>
            <TouchableOpacity style={styles.botaoSecundario} onPress={handleRefazer}>
              <Text style={styles.botaoSecundarioTexto}>↺ Refazer assinatura</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Modo de desenho — botões limpar e confirmar
          <View style={styles.acoes}>
            <TouchableOpacity style={styles.botaoLimpar} onPress={handleLimpar}>
              <Text style={styles.botaoLimparTexto}>✕ Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoConfirmar, assinado && styles.botaoConfirmarAtivo]}
              onPress={handleConfirmar}
            >
              <Text style={[styles.botaoConfirmarTexto, assinado && styles.botaoConfirmarTextoAtivo]}>
                ✓ Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.rodape}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={onBack}>
          <Text style={styles.botaoVoltarTexto}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoProximo, !modoPrevia && styles.botaoDesabilitado]}
          onPress={onNext}
          disabled={!modoPrevia}
        >
          <Text style={styles.botaoProximoTexto}>
            {modoPrevia ? 'Próximo' : 'Assine para continuar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  corpo: { flex: 1, padding: 16 },

  instrucao: {
    fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 16,
  },

  canvasWrapper: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    position: 'relative',
  },
  canvas: { flex: 1, backgroundColor: '#fff' },
  previa: { flex: 1, backgroundColor: '#fff' },

  // Linha guia horizontal no terço inferior do canvas
  linhaGuia: {
    position: 'absolute',
    bottom: '30%',
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: '#e0e0e0',
  },

  acoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  botaoLimpar: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  botaoLimparTexto: { fontSize: 14, color: '#888' },

  botaoConfirmar: {
    flex: 2, paddingVertical: 10, borderRadius: 8,
    borderWidth: 1.5, borderColor: '#ddd',
    alignItems: 'center', backgroundColor: '#fafafa',
  },
  botaoConfirmarAtivo: { borderColor: '#1a73e8', backgroundColor: '#e8f0fe' },
  botaoConfirmarTexto: { fontSize: 14, color: '#aaa', fontWeight: '600' },
  botaoConfirmarTextoAtivo: { color: '#1a73e8' },

  badgeConfirmado: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    backgroundColor: '#f6fef7', borderWidth: 1, borderColor: '#34a853',
    alignItems: 'center',
  },
  badgeConfirmadoTexto: { fontSize: 14, color: '#34a853', fontWeight: '600' },

  botaoSecundario: {
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  botaoSecundarioTexto: { fontSize: 14, color: '#666' },

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

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { PassoProps } from '../../types';
import ProgressoPasso from '../../components/ProgressoPasso';

// Aceita formato antigo (ABC1234) e Mercosul (ABC1D23)
const REGEX_PLACA = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

function validarPlaca(placa: string): string | null {
  if (placa.length === 0) return null;
  if (placa.length < 7) return 'A placa deve ter 7 caracteres.';
  if (!REGEX_PLACA.test(placa)) return 'Formato inválido. Use ABC1234 ou ABC1D23.';
  return null;
}

function validarAno(ano: string): string | null {
  if (ano.length === 0) return null;
  const num = Number(ano);
  if (ano.length < 4) return 'Digite o ano completo (4 dígitos).';
  if (num < 1900 || num > 2100) return 'Ano inválido.';
  return null;
}

export default function Passo1Veiculo({ dados, atualizar, onNext, onBack, passo, totalPassos }: PassoProps) {
  const [tocado, setTocado] = useState({ placa: false, marca: false, modelo: false, ano: false });

  const erroPlaca = validarPlaca(dados.placa);
  const erroAno = validarAno(dados.ano);

  const podeProsseguir =
    dados.placa.length === 7 &&
    !erroPlaca &&
    dados.marca.trim().length > 0 &&
    dados.modelo.trim().length > 0 &&
    dados.ano.length === 4 &&
    !erroAno;

  function marcarTocado(campo: keyof typeof tocado) {
    setTocado(prev => ({ ...prev, [campo]: true }));
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ProgressoPasso passo={passo} totalPassos={totalPassos} titulo="Identificação do Veículo" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <Text style={styles.label}>Placa *</Text>
        <TextInput
          style={[styles.input, tocado.placa && erroPlaca ? styles.inputErro : null]}
          placeholder="ABC1234 ou ABC1D23"
          value={dados.placa}
          onChangeText={v => atualizar({ placa: v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7) })}
          onBlur={() => marcarTocado('placa')}
          autoCapitalize="characters"
          maxLength={7}
        />
        {tocado.placa && erroPlaca && <Text style={styles.erro}>{erroPlaca}</Text>}

        <Text style={styles.label}>Marca *</Text>
        <TextInput
          style={[styles.input, tocado.marca && !dados.marca.trim() ? styles.inputErro : null]}
          placeholder="Ex: Volkswagen"
          value={dados.marca}
          onChangeText={v => atualizar({ marca: v })}
          onBlur={() => marcarTocado('marca')}
        />
        {tocado.marca && !dados.marca.trim() && <Text style={styles.erro}>Campo obrigatório.</Text>}

        <Text style={styles.label}>Modelo *</Text>
        <TextInput
          style={[styles.input, tocado.modelo && !dados.modelo.trim() ? styles.inputErro : null]}
          placeholder="Ex: Gol"
          value={dados.modelo}
          onChangeText={v => atualizar({ modelo: v })}
          onBlur={() => marcarTocado('modelo')}
        />
        {tocado.modelo && !dados.modelo.trim() && <Text style={styles.erro}>Campo obrigatório.</Text>}

        <Text style={styles.label}>Ano *</Text>
        <TextInput
          style={[styles.input, tocado.ano && erroAno ? styles.inputErro : null]}
          placeholder="Ex: 2021"
          value={dados.ano}
          onChangeText={v => atualizar({ ano: v.replace(/[^0-9]/g, '').slice(0, 4) })}
          onBlur={() => marcarTocado('ano')}
          keyboardType="numeric"
          maxLength={4}
        />
        {tocado.ano && erroAno && <Text style={styles.erro}>{erroAno}</Text>}

      </ScrollView>

      <View style={styles.rodape}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={onBack}>
          <Text style={styles.botaoVoltarTexto}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoProximo, !podeProsseguir && styles.botaoDesabilitado]}
          onPress={onNext}
          disabled={!podeProsseguir}
        >
          <Text style={styles.botaoProximoTexto}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 12, fontSize: 15, backgroundColor: '#fafafa',
  },
  inputErro: { borderColor: '#ea4335' },
  erro: { fontSize: 12, color: '#ea4335', marginTop: 4 },
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
  botaoProximo: {
    flex: 2, padding: 14, borderRadius: 8,
    backgroundColor: '#1a73e8', alignItems: 'center',
  },
  botaoDesabilitado: { backgroundColor: '#b0c8f5' },
  botaoProximoTexto: { fontSize: 15, color: '#fff', fontWeight: '600' },
});

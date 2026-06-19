import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Checklist } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FormularioVistoria'>;
  route: RouteProp<RootStackParamList, 'FormularioVistoria'>;
};

const checklistInicial: Checklist = {
  documentacao: false,
  lataria: false,
  vidros: false,
  pneus: false,
  freios: false,
  luzes: false,
  motor: false,
  suspensao: false,
  escape: false,
  interior: false,
};

const checklistLabels: Record<keyof Checklist, string> = {
  documentacao: 'Documentação',
  lataria: 'Lataria',
  vidros: 'Vidros',
  pneus: 'Pneus',
  freios: 'Freios',
  luzes: 'Luzes',
  motor: 'Motor',
  suspensao: 'Suspensão',
  escape: 'Escapamento',
  interior: 'Interior',
};

export default function FormularioVistoriaScreen({ navigation }: Props) {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [renavam, setRenavam] = useState('');
  const [proprietario, setProprietario] = useState('');
  const [checklist, setChecklist] = useState<Checklist>(checklistInicial);
  const [observacoes, setObservacoes] = useState('');

  function toggleItem(key: keyof Checklist) {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSalvar() {
    // TODO: salvar vistoria via API
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.secao}>Dados do Veículo</Text>
      <TextInput style={styles.input} placeholder="Placa" value={placa} onChangeText={setPlaca} autoCapitalize="characters" />
      <TextInput style={styles.input} placeholder="Modelo" value={modelo} onChangeText={setModelo} />
      <TextInput style={styles.input} placeholder="Ano" value={ano} onChangeText={setAno} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Cor" value={cor} onChangeText={setCor} />
      <TextInput style={styles.input} placeholder="RENAVAM" value={renavam} onChangeText={setRenavam} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Proprietário" value={proprietario} onChangeText={setProprietario} />

      <Text style={styles.secao}>Checklist</Text>
      {(Object.keys(checklist) as (keyof Checklist)[]).map((key) => (
        <View key={key} style={styles.checkItem}>
          <Text style={styles.checkLabel}>{checklistLabels[key]}</Text>
          <Switch value={checklist[key]} onValueChange={() => toggleItem(key)} />
        </View>
      ))}

      <Text style={styles.secao}>Observações</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Observações gerais..."
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.botaoTexto}>Salvar Vistoria</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  secao: { fontSize: 16, fontWeight: '700', color: '#1a73e8', marginTop: 20, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  checkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkLabel: { fontSize: 15, color: '#333' },
  botao: { backgroundColor: '#1a73e8', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

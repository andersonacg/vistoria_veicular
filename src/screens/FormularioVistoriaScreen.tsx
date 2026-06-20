import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import {
  AppStackParamList,
  ChecklistEstetica,
  ChecklistMecanica,
  ItemChecklist,
} from '../types';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParamList, 'FormularioVistoria'>;
  route: RouteProp<AppStackParamList, 'FormularioVistoria'>;
};

const esteticaInicial: ChecklistEstetica = {
  lataria: null, vidros: null, farois: null, para_brisas: null, para_choques: null,
};

const mecanicaInicial: ChecklistMecanica = {
  pneus: null, estepe: null, oleo: null, freios: null, suspensao: null,
};

const esteticaLabels: Record<keyof ChecklistEstetica, string> = {
  lataria: 'Lataria', vidros: 'Vidros', farois: 'Faróis',
  para_brisas: 'Para-brisa', para_choques: 'Para-choques',
};

const mecanicaLabels: Record<keyof ChecklistMecanica, string> = {
  pneus: 'Pneus', estepe: 'Estepe', oleo: 'Óleo',
  freios: 'Freios', suspensao: 'Suspensão',
};

function BotoesItem({
  valor,
  onChange,
}: {
  valor: ItemChecklist;
  onChange: (v: ItemChecklist) => void;
}) {
  return (
    <View style={styles.botoesItem}>
      <TouchableOpacity
        style={[styles.botaoItem, valor === 'ok' && styles.botaoOkAtivo]}
        onPress={() => onChange(valor === 'ok' ? null : 'ok')}
      >
        <Text style={[styles.botaoItemTexto, valor === 'ok' && styles.textoAtivo]}>OK</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.botaoItem, valor === 'avaria' && styles.botaoAvariaAtivo]}
        onPress={() => onChange(valor === 'avaria' ? null : 'avaria')}
      >
        <Text style={[styles.botaoItemTexto, valor === 'avaria' && styles.textoAtivo]}>Avaria</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function FormularioVistoriaScreen({ navigation }: Props) {
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [estetica, setEstetica] = useState<ChecklistEstetica>(esteticaInicial);
  const [mecanica, setMecanica] = useState<ChecklistMecanica>(mecanicaInicial);
  const [observacoes, setObservacoes] = useState('');

  function setItemEstetica(key: keyof ChecklistEstetica, valor: ItemChecklist) {
    setEstetica((prev) => ({ ...prev, [key]: valor }));
  }

  function setItemMecanica(key: keyof ChecklistMecanica, valor: ItemChecklist) {
    setMecanica((prev) => ({ ...prev, [key]: valor }));
  }

  function handleSalvar() {
    // TODO: salvar via supabase.from('vistorias').insert()
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.secao}>Dados do Veículo</Text>
      <TextInput style={styles.input} placeholder="Placa" value={placa} onChangeText={setPlaca} autoCapitalize="characters" />
      <TextInput style={styles.input} placeholder="Marca" value={marca} onChangeText={setMarca} />
      <TextInput style={styles.input} placeholder="Modelo" value={modelo} onChangeText={setModelo} />
      <TextInput style={styles.input} placeholder="Ano" value={ano} onChangeText={setAno} keyboardType="numeric" />

      <Text style={styles.secao}>Checklist Estética</Text>
      {(Object.keys(esteticaInicial) as (keyof ChecklistEstetica)[]).map((key) => (
        <View key={key} style={styles.checkItem}>
          <Text style={styles.checkLabel}>{esteticaLabels[key]}</Text>
          <BotoesItem valor={estetica[key]} onChange={(v) => setItemEstetica(key, v)} />
        </View>
      ))}

      <Text style={styles.secao}>Checklist Mecânica</Text>
      {(Object.keys(mecanicaInicial) as (keyof ChecklistMecanica)[]).map((key) => (
        <View key={key} style={styles.checkItem}>
          <Text style={styles.checkLabel}>{mecanicaLabels[key]}</Text>
          <BotoesItem valor={mecanica[key]} onChange={(v) => setItemMecanica(key, v)} />
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

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.botaoSalvarTexto}>Salvar Vistoria</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  secao: { fontSize: 16, fontWeight: '700', color: '#1a73e8', marginTop: 20, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 12, marginBottom: 12, fontSize: 15,
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  checkItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  checkLabel: { fontSize: 15, color: '#333', flex: 1 },
  botoesItem: { flexDirection: 'row', gap: 8 },
  botaoItem: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 6, borderWidth: 1, borderColor: '#ccc',
  },
  botaoOkAtivo: { backgroundColor: '#34a853', borderColor: '#34a853' },
  botaoAvariaAtivo: { backgroundColor: '#ea4335', borderColor: '#ea4335' },
  botaoItemTexto: { fontSize: 13, color: '#555' },
  textoAtivo: { color: '#fff', fontWeight: '600' },
  botaoSalvar: {
    backgroundColor: '#1a73e8', padding: 16, borderRadius: 8,
    alignItems: 'center', marginTop: 24,
  },
  botaoSalvarTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

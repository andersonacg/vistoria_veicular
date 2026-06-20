import React, { useState } from 'react';
import { Alert, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import {
  AppStackParamList, DadosFormulario,
  ChecklistEstetica, ChecklistMecanica, FotosVistoria,
} from '../types';
import { useAuth } from '../context/AuthContext';
import { salvarVistoria } from '../services/vistorias';
import Passo1Veiculo from './formulario/Passo1Veiculo';
import Passo2Chassi from './formulario/Passo2Chassi';
import Passo3Estetica from './formulario/Passo3Estetica';
import Passo4Mecanica from './formulario/Passo4Mecanica';
import Passo5Fotos from './formulario/Passo5Fotos';
import Passo6Assinatura from './formulario/Passo6Assinatura';
import Passo7Revisao from './formulario/Passo7Revisao';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParamList, 'FormularioVistoria'>;
  route: RouteProp<AppStackParamList, 'FormularioVistoria'>;
};

const dadosIniciais: DadosFormulario = {
  placa: '', marca: '', modelo: '', ano: '',
  numero_chassi: '',
  foto_chassi: null,
  checklist_estetica: {
    lataria: { status: null }, vidros: { status: null }, farois: { status: null },
    para_brisas: { status: null }, para_choques: { status: null },
  },
  checklist_mecanica: {
    pneus: { status: null }, estepe: { status: null }, oleo: { status: null },
    freios: { status: null }, suspensao: { status: null },
  },
  fotos: {
    frente: null, traseira: null, lateral_esquerda: null, lateral_direita: null, motor: null,
  },
  assinatura: null,
  observacoes: '',
};

const TOTAL_PASSOS = 7;

export default function FormularioVistoriaScreen({ navigation }: Props) {
  const { session } = useAuth();
  const [passo, setPasso] = useState(1);
  const [dados, setDados] = useState<DadosFormulario>(dadosIniciais);
  const [salvando, setSalvando] = useState(false);

  function atualizar(parcial: Partial<DadosFormulario>) {
    setDados(prev => ({ ...prev, ...parcial }));
  }

  async function salvar() {
    console.log('[salvar] botão tocado, session?.user?.id:', session?.user?.id ?? 'null');
    if (!session?.user?.id) {
      Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
      return;
    }
    setSalvando(true);
    try {
      console.log('[salvar] chamando salvarVistoria...');
      const id = await salvarVistoria(dados, session.user.id);
      console.log('[salvar] sucesso! id:', id);
      Alert.alert(
        'Vistoria salva!',
        `Vistoria do veículo ${dados.placa} registrada com sucesso.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (erro: any) {
      const mensagem = erro?.message ?? String(erro) ?? 'Erro desconhecido. Verifique o console.';
      console.error('[salvar] ERRO capturado:', erro);
      Alert.alert('Erro ao salvar', mensagem);
    } finally {
      console.log('[salvar] finally — setSalvando(false)');
      setSalvando(false);
    }
  }

  function avancar() {
    if (passo < TOTAL_PASSOS) {
      setPasso(p => p + 1);
    } else {
      salvar();
    }
  }

  function voltar() {
    if (passo === 1) {
      Alert.alert('Cancelar vistoria', 'Os dados preenchidos serão perdidos. Deseja cancelar?', [
        { text: 'Continuar preenchendo', style: 'cancel' },
        { text: 'Cancelar vistoria', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    } else {
      setPasso(p => p - 1);
    }
  }

  if (salvando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={styles.loadingTexto}>Enviando fotos e salvando vistoria...</Text>
      </View>
    );
  }

  const passoProps = { dados, atualizar, onNext: avancar, onBack: voltar, passo, totalPassos: TOTAL_PASSOS };

  switch (passo) {
    case 1: return <Passo1Veiculo {...passoProps} />;
    case 2: return <Passo2Chassi {...passoProps} />;
    case 3: return <Passo3Estetica {...passoProps} />;
    case 4: return <Passo4Mecanica {...passoProps} />;
    case 5: return <Passo5Fotos {...passoProps} />;
    case 6: return <Passo6Assinatura {...passoProps} />;
    case 7: return <Passo7Revisao {...passoProps} />;
    default: return null;
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    gap: 16, backgroundColor: '#fff',
  },
  loadingTexto: { fontSize: 15, color: '#555', textAlign: 'center', paddingHorizontal: 32 },
});

import React, { useState } from 'react';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import {
  AppStackParamList, DadosFormulario,
  ChecklistEstetica, ChecklistMecanica, FotosVistoria,
} from '../types';
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

const esteticaInicial: ChecklistEstetica = {
  lataria: null, vidros: null, farois: null, para_brisas: null, para_choques: null,
};

const mecanicaInicial: ChecklistMecanica = {
  pneus: null, estepe: null, oleo: null, freios: null, suspensao: null,
};

const fotosIniciais: FotosVistoria = {
  frente: null, traseira: null, lateral_esquerda: null, lateral_direita: null, motor: null,
};

const dadosIniciais: DadosFormulario = {
  placa: '', marca: '', modelo: '', ano: '',
  foto_chassi: null,
  checklist_estetica: esteticaInicial,
  checklist_mecanica: mecanicaInicial,
  fotos: fotosIniciais,
  assinatura: null,
  observacoes: '',
};

const TOTAL_PASSOS = 7;

export default function FormularioVistoriaScreen({ navigation }: Props) {
  const [passo, setPasso] = useState(1);
  const [dados, setDados] = useState<DadosFormulario>(dadosIniciais);

  function atualizar(parcial: Partial<DadosFormulario>) {
    setDados(prev => ({ ...prev, ...parcial }));
  }

  function avancar() {
    if (passo < TOTAL_PASSOS) {
      setPasso(p => p + 1);
    } else {
      // TODO: salvar vistoria no Supabase
      navigation.goBack();
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

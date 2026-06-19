export interface Vistoria {
  id: string;
  placa: string;
  modelo: string;
  ano: number;
  cor: string;
  renavam: string;
  proprietario: string;
  inspetor: string;
  data: string;
  status: 'pendente' | 'em_andamento' | 'concluida';
  checklist: Checklist;
  fotos: string[];
  observacoes: string;
}

export interface Checklist {
  documentacao: boolean;
  lataria: boolean;
  vidros: boolean;
  pneus: boolean;
  freios: boolean;
  luzes: boolean;
  motor: boolean;
  suspensao: boolean;
  escape: boolean;
  interior: boolean;
}

export interface Inspetor {
  id: string;
  nome: string;
  crea: string;
  email: string;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  NovaVistoria: undefined;
  FormularioVistoria: { vistoriaId?: string };
  DetalhesVistoria: { vistoriaId: string };
};

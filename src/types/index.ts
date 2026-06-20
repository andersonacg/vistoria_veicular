export type ItemChecklist = 'ok' | 'avaria' | null;

export interface ChecklistEstetica {
  lataria:      ItemChecklist;
  vidros:       ItemChecklist;
  farois:       ItemChecklist;
  para_brisas:  ItemChecklist;
  para_choques: ItemChecklist;
}

export interface ChecklistMecanica {
  pneus:     ItemChecklist;
  estepe:    ItemChecklist;
  oleo:      ItemChecklist;
  freios:    ItemChecklist;
  suspensao: ItemChecklist;
}

export interface FotosVistoria {
  frente:           string | null;
  traseira:         string | null;
  lateral_esquerda: string | null;
  lateral_direita:  string | null;
  motor:            string | null;
}

export interface Vistoria {
  id:                 string;
  placa:              string;
  modelo:             string;
  marca:              string;
  ano:                number;
  inspetor_id:        string;
  data:               string;
  status:             'pendente' | 'em_andamento' | 'concluida';
  checklist_estetica: ChecklistEstetica;
  checklist_mecanica: ChecklistMecanica;
  fotos:              FotosVistoria;
  foto_chassi:        string | null;
  assinatura:         string | null;
  observacoes:        string;
  created_at:         string;
  updated_at:         string;
}

export interface Inspetor {
  id:    string;
  nome:  string;
  email: string;
}

export type AppStackParamList = {
  Home: undefined;
  FormularioVistoria: { vistoriaId?: string };
  DetalhesVistoria: { vistoriaId: string };
};

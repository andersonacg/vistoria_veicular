import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, TextInput,
} from 'react-native';
import {
  PassoProps, ChecklistEstetica, ChecklistMecanica,
  FotosVistoria, ItemChecklist,
} from '../../types';
import ProgressoPasso from '../../components/ProgressoPasso';

// ─── Labels ──────────────────────────────────────────────────────────────────

const LABELS_ESTETICA: Record<keyof ChecklistEstetica, string> = {
  lataria: 'Lataria', vidros: 'Vidros', farois: 'Faróis',
  para_brisas: 'Para-brisa', para_choques: 'Para-choques',
};

const LABELS_MECANICA: Record<keyof ChecklistMecanica, string> = {
  pneus: 'Pneus', estepe: 'Estepe', oleo: 'Óleo',
  freios: 'Freios', suspensao: 'Suspensão',
};

const LABELS_FOTOS: Record<keyof FotosVistoria, string> = {
  frente: 'Frente', traseira: 'Traseira',
  lateral_esquerda: 'Lat. Esquerda', lateral_direita: 'Lat. Direita',
  motor: 'Motor',
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      {children}
    </View>
  );
}

function LinhaInfo({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.linhaInfo}>
      <Text style={styles.linhaLabel}>{label}</Text>
      <Text style={styles.linhaValor}>{valor}</Text>
    </View>
  );
}

function BadgeChecklist({ valor }: { valor: ItemChecklist }) {
  if (valor === 'ok') return <Text style={styles.badgeOk}>✓ OK</Text>;
  if (valor === 'avaria') return <Text style={styles.badgeAvaria}>✕ Avaria</Text>;
  return <Text style={styles.badgeVazio}>—</Text>;
}

function LinhaChecklist({ label, valor }: { label: string; valor: ItemChecklist }) {
  return (
    <View style={styles.linhaChecklist}>
      <Text style={styles.linhaChecklistLabel}>{label}</Text>
      <BadgeChecklist valor={valor} />
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function Passo7Revisao({ dados, atualizar, onNext, onBack, passo, totalPassos }: PassoProps) {
  const { placa, marca, modelo, ano, foto_chassi, checklist_estetica,
    checklist_mecanica, fotos, assinatura, observacoes } = dados;

  const avariaEstetica = (Object.keys(checklist_estetica) as (keyof ChecklistEstetica)[])
    .filter(k => checklist_estetica[k] === 'avaria').length;
  const avariaMecanica = (Object.keys(checklist_mecanica) as (keyof ChecklistMecanica)[])
    .filter(k => checklist_mecanica[k] === 'avaria').length;
  const totalAvarias = avariaEstetica + avariaMecanica;

  return (
    <View style={styles.container}>
      <ProgressoPasso passo={passo} totalPassos={totalPassos} titulo="Revisão Final" />

      <ScrollView contentContainerStyle={styles.content}>

        {/* Resumo de avarias */}
        {totalAvarias > 0 && (
          <View style={styles.alertaAvarias}>
            <Text style={styles.alertaTexto}>
              ⚠️ {totalAvarias} {totalAvarias === 1 ? 'avaria registrada' : 'avarias registradas'}
              {' '}({avariaEstetica} estética{avariaEstetica !== 1 ? 's' : ''}, {avariaMecanica} mecânica{avariaMecanica !== 1 ? 's' : ''})
            </Text>
          </View>
        )}

        {/* Veículo */}
        <Secao titulo="Veículo">
          <LinhaInfo label="Placa" valor={placa} />
          <LinhaInfo label="Marca" valor={marca} />
          <LinhaInfo label="Modelo" valor={modelo} />
          <LinhaInfo label="Ano" valor={ano} />
        </Secao>

        {/* Chassi */}
        <Secao titulo="Foto do Chassi">
          {foto_chassi ? (
            <Image source={{ uri: foto_chassi }} style={styles.fotoChassi} resizeMode="cover" />
          ) : (
            <Text style={styles.naoInformado}>Não fotografado</Text>
          )}
        </Secao>

        {/* Checklist Estética */}
        <Secao titulo="Checklist Estética">
          {(Object.keys(LABELS_ESTETICA) as (keyof ChecklistEstetica)[]).map(k => (
            <LinhaChecklist key={k} label={LABELS_ESTETICA[k]} valor={checklist_estetica[k]} />
          ))}
        </Secao>

        {/* Checklist Mecânica */}
        <Secao titulo="Checklist Mecânica">
          {(Object.keys(LABELS_MECANICA) as (keyof ChecklistMecanica)[]).map(k => (
            <LinhaChecklist key={k} label={LABELS_MECANICA[k]} valor={checklist_mecanica[k]} />
          ))}
        </Secao>

        {/* Fotos obrigatórias */}
        <Secao titulo="Fotos Obrigatórias">
          <View style={styles.gradeMiniaturas}>
            {(Object.keys(LABELS_FOTOS) as (keyof FotosVistoria)[]).map(k => (
              <View key={k} style={styles.miniaturaItem}>
                {fotos[k] ? (
                  <Image source={{ uri: fotos[k]! }} style={styles.miniatura} resizeMode="cover" />
                ) : (
                  <View style={[styles.miniatura, styles.miniaturaVazia]} />
                )}
                <Text style={styles.miniaturaLabel}>{LABELS_FOTOS[k]}</Text>
              </View>
            ))}
          </View>
        </Secao>

        {/* Assinatura */}
        <Secao titulo="Assinatura do Vistoriador">
          {assinatura ? (
            <Image source={{ uri: assinatura }} style={styles.assinatura} resizeMode="contain" />
          ) : (
            <Text style={styles.naoInformado}>Não assinado</Text>
          )}
        </Secao>

        {/* Observações */}
        <Secao titulo="Observações (opcional)">
          <TextInput
            style={styles.textarea}
            placeholder="Adicione observações gerais sobre a vistoria..."
            value={observacoes}
            onChangeText={v => atualizar({ observacoes: v })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Secao>

      </ScrollView>

      <View style={styles.rodape}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={onBack}>
          <Text style={styles.botaoVoltarTexto}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoSalvar} onPress={onNext}>
          <Text style={styles.botaoSalvarTexto}>Salvar Vistoria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 8, gap: 12 },

  alertaAvarias: {
    backgroundColor: '#fff8e1', borderRadius: 8, padding: 12,
    borderLeftWidth: 4, borderLeftColor: '#f9a825',
  },
  alertaTexto: { fontSize: 13, color: '#7a5c00', fontWeight: '500' },

  secao: {
    backgroundColor: '#fff', borderRadius: 10,
    padding: 14, borderWidth: 1, borderColor: '#e8e8e8',
  },
  secaoTitulo: {
    fontSize: 13, fontWeight: '700', color: '#1a73e8',
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: 10,
  },

  linhaInfo: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  linhaLabel: { fontSize: 14, color: '#777' },
  linhaValor: { fontSize: 14, color: '#222', fontWeight: '600' },

  linhaChecklist: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  linhaChecklistLabel: { fontSize: 14, color: '#333' },
  badgeOk: {
    fontSize: 12, fontWeight: '700', color: '#34a853',
    backgroundColor: '#f0faf2', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeAvaria: {
    fontSize: 12, fontWeight: '700', color: '#ea4335',
    backgroundColor: '#fef0ef', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeVazio: { fontSize: 12, color: '#bbb' },

  fotoChassi: { width: '100%', height: 160, borderRadius: 8 },

  gradeMiniaturas: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
  },
  miniaturaItem: { alignItems: 'center', gap: 4 },
  miniatura: { width: 88, height: 66, borderRadius: 6, backgroundColor: '#eee' },
  miniaturaVazia: { borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed' },
  miniaturaLabel: { fontSize: 10, color: '#666', textAlign: 'center' },

  assinatura: {
    width: '100%', height: 100,
    backgroundColor: '#fafafa', borderRadius: 8,
    borderWidth: 1, borderColor: '#eee',
  },

  naoInformado: { fontSize: 13, color: '#aaa', fontStyle: 'italic' },

  textarea: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 10, fontSize: 14, minHeight: 90,
    backgroundColor: '#fafafa',
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
  botaoSalvar: {
    flex: 2, padding: 14, borderRadius: 8,
    backgroundColor: '#34a853', alignItems: 'center',
  },
  botaoSalvarTexto: { fontSize: 15, color: '#fff', fontWeight: '700' },
});

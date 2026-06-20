import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { PassoProps, ChecklistMecanica, ItemChecklist } from '../../types';
import ProgressoPasso from '../../components/ProgressoPasso';

const ITENS: { chave: keyof ChecklistMecanica; label: string; descricao: string }[] = [
  { chave: 'pneus',     label: 'Pneus',     descricao: 'Desgaste da banda de rodagem, cortes, bolhas ou pressão visivelmente baixa' },
  { chave: 'estepe',    label: 'Estepe',    descricao: 'Presença, condição do pneu reserva e do macaco' },
  { chave: 'oleo',      label: 'Óleo',      descricao: 'Nível e coloração do óleo do motor — verificar vareta' },
  { chave: 'freios',    label: 'Freios',    descricao: 'Espessura das pastilhas (visível pela roda) e condição do fluido' },
  { chave: 'suspensao', label: 'Suspensão', descricao: 'Amortecedores, bandejas e buchas — ruídos ou folgas perceptíveis' },
];

function BotoesItem({ valor, onChange }: { valor: ItemChecklist; onChange: (v: ItemChecklist) => void }) {
  return (
    <View style={styles.botoesItem}>
      <TouchableOpacity
        style={[styles.botaoItem, valor === 'ok' && styles.botaoOkAtivo]}
        onPress={() => onChange(valor === 'ok' ? null : 'ok')}
        activeOpacity={0.7}
      >
        <Text style={[styles.botaoItemTexto, valor === 'ok' && styles.textoAtivo]}>✓  OK</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.botaoItem, valor === 'avaria' && styles.botaoAvariaAtivo]}
        onPress={() => onChange(valor === 'avaria' ? null : 'avaria')}
        activeOpacity={0.7}
      >
        <Text style={[styles.botaoItemTexto, valor === 'avaria' && styles.textoAtivo]}>✕  Avaria</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Passo4Mecanica({ dados, atualizar, onNext, onBack, passo, totalPassos }: PassoProps) {
  const checklist = dados.checklist_mecanica;

  function setItem(chave: keyof ChecklistMecanica, valor: ItemChecklist) {
    atualizar({ checklist_mecanica: { ...checklist, [chave]: valor } });
  }

  const totalRespondidos = ITENS.filter(i => checklist[i.chave] !== null).length;
  const podeProsseguir = totalRespondidos === ITENS.length;

  return (
    <View style={styles.container}>
      <ProgressoPasso passo={passo} totalPassos={totalPassos} titulo="Checklist Mecânica" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instrucao}>
          Avalie cada item mecanicamente. Toque em{' '}
          <Text style={styles.destOk}>OK</Text> se estiver sem danos ou{' '}
          <Text style={styles.destAvaria}>Avaria</Text> se houver algum problema.
        </Text>

        <View style={styles.contadorRow}>
          <View style={styles.contadorBadge}>
            <Text style={styles.contadorTexto}>{totalRespondidos}/{ITENS.length} avaliados</Text>
          </View>
        </View>

        {ITENS.map((item, index) => {
          const valor = checklist[item.chave];
          return (
            <View
              key={item.chave}
              style={[
                styles.card,
                valor === 'ok' && styles.cardOk,
                valor === 'avaria' && styles.cardAvaria,
              ]}
            >
              <View style={styles.cardTopo}>
                <View style={styles.cardNumero}>
                  <Text style={styles.cardNumeroTexto}>{index + 1}</Text>
                </View>
                <View style={styles.cardTextos}>
                  <Text style={styles.cardLabel}>{item.label}</Text>
                  <Text style={styles.cardDescricao}>{item.descricao}</Text>
                </View>
                {valor !== null && (
                  <Text style={valor === 'ok' ? styles.badgeOk : styles.badgeAvaria}>
                    {valor === 'ok' ? '✓' : '✕'}
                  </Text>
                )}
              </View>
              <BotoesItem valor={valor} onChange={v => setItem(item.chave, v)} />
            </View>
          );
        })}
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
            {podeProsseguir ? 'Próximo' : `Faltam ${ITENS.length - totalRespondidos}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 8, gap: 12 },

  instrucao: { fontSize: 14, color: '#555', lineHeight: 20 },
  destOk: { color: '#34a853', fontWeight: '600' },
  destAvaria: { color: '#ea4335', fontWeight: '600' },

  contadorRow: { alignItems: 'flex-end' },
  contadorBadge: {
    backgroundColor: '#e8f0fe', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  contadorTexto: { fontSize: 12, color: '#1a73e8', fontWeight: '600' },

  card: {
    backgroundColor: '#fff', borderRadius: 10,
    padding: 14, borderWidth: 1.5, borderColor: '#e0e0e0',
  },
  cardOk: { borderColor: '#34a853', backgroundColor: '#f6fef7' },
  cardAvaria: { borderColor: '#ea4335', backgroundColor: '#fff8f8' },

  cardTopo: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  cardNumero: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#1a73e8', justifyContent: 'center', alignItems: 'center',
    marginRight: 10, marginTop: 2, flexShrink: 0,
  },
  cardNumeroTexto: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardTextos: { flex: 1 },
  cardLabel: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 2 },
  cardDescricao: { fontSize: 12, color: '#777', lineHeight: 17 },
  badgeOk: { fontSize: 18, color: '#34a853', fontWeight: '700', marginLeft: 8 },
  badgeAvaria: { fontSize: 18, color: '#ea4335', fontWeight: '700', marginLeft: 8 },

  botoesItem: { flexDirection: 'row', gap: 10 },
  botaoItem: {
    flex: 1, paddingVertical: 9, borderRadius: 7,
    borderWidth: 1.5, borderColor: '#ddd',
    alignItems: 'center', backgroundColor: '#fafafa',
  },
  botaoOkAtivo: { backgroundColor: '#34a853', borderColor: '#34a853' },
  botaoAvariaAtivo: { backgroundColor: '#ea4335', borderColor: '#ea4335' },
  botaoItemTexto: { fontSize: 14, color: '#666', fontWeight: '500' },
  textoAtivo: { color: '#fff', fontWeight: '700' },

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

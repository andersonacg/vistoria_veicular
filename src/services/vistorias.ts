import { supabase } from '../config/supabase';
import { DadosFormulario, FotosVistoria, Vistoria, ChecklistEstetica, ChecklistMecanica } from '../types';

export async function buscarVistorias(inspetorId: string): Promise<Vistoria[]> {
  const { data, error } = await supabase
    .from('vistorias')
    .select('id, placa, marca, modelo, ano, status, checklist_estetica, checklist_mecanica, created_at')
    .eq('inspetor_id', inspetorId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Erro ao buscar vistorias: ${error.message}`);
  return (data ?? []) as Vistoria[];
}

function gerarId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

async function uploadFoto(localUri: string, caminho: string): Promise<string> {
  console.log('[uploadFoto] iniciando:', caminho);
  console.log('[uploadFoto] uri:', localUri?.substring(0, 80));

  const resposta = await fetch(localUri);
  if (!resposta.ok) {
    throw new Error(`Falha ao ler arquivo local (${caminho}): HTTP ${resposta.status}`);
  }

  const arrayBuffer = await resposta.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  console.log('[uploadFoto] leitura ok, tamanho:', bytes.byteLength, 'bytes');

  const { error } = await supabase.storage
    .from('vistorias')
    .upload(caminho, bytes, { contentType: 'image/jpeg', upsert: true });

  if (error) {
    console.error('[uploadFoto] erro no storage:', JSON.stringify(error));
    throw new Error(`Erro ao enviar foto (${caminho}): ${error.message}`);
  }

  const { data } = supabase.storage.from('vistorias').getPublicUrl(caminho);
  console.log('[uploadFoto] upload ok');
  return data.publicUrl;
}

export async function salvarVistoria(
  dados: DadosFormulario,
  inspetorId: string
): Promise<string> {
  console.log('[salvarVistoria] início — inspetorId:', inspetorId);
  console.log('[salvarVistoria] placa:', dados.placa, '| fotos preenchidas:',
    Object.entries(dados.fotos).filter(([, v]) => !!v).map(([k]) => k));

  const vistoriaId = gerarId();
  const pasta = `${inspetorId}/${vistoriaId}`;
  console.log('[salvarVistoria] vistoriaId gerado:', vistoriaId);

  // Upload das 5 fotos obrigatórias em paralelo
  const entradas = Object.entries(dados.fotos) as [keyof FotosVistoria, string | null][];
  console.log('[salvarVistoria] iniciando upload de', entradas.filter(([, v]) => !!v).length, 'fotos');
  const uploads = await Promise.all(
    entradas.map(async ([chave, uri]) => {
      if (!uri) return [chave, null] as const;
      const url = await uploadFoto(uri, `${pasta}/fotos/${chave}.jpg`);
      return [chave, url] as const;
    })
  );
  const fotosUrls = Object.fromEntries(uploads) as FotosVistoria;
  console.log('[salvarVistoria] uploads concluídos');

  // Upload da foto do chassi (opcional)
  let urlChassi: string | null = null;
  if (dados.foto_chassi) {
    console.log('[salvarVistoria] fazendo upload da foto do chassi');
    urlChassi = await uploadFoto(dados.foto_chassi, `${pasta}/chassi.jpg`);
  }

  // Salvar registro no banco
  console.log('[salvarVistoria] inserindo no banco...');
  const { error } = await supabase.from('vistorias').insert({
    id: vistoriaId,
    placa: dados.placa,
    marca: dados.marca,
    modelo: dados.modelo,
    ano: parseInt(dados.ano, 10),
    inspetor_id: inspetorId,
    status: 'concluida',
    checklist_estetica: dados.checklist_estetica,
    checklist_mecanica: dados.checklist_mecanica,
    fotos: fotosUrls,
    foto_chassi: urlChassi,
    assinatura: dados.assinatura,
    observacoes: dados.observacoes,
  });

  if (error) {
    console.error('[salvarVistoria] erro no insert:', error);
    throw new Error(`Erro ao salvar vistoria: ${error.message}`);
  }

  console.log('[salvarVistoria] vistoria salva com sucesso! id:', vistoriaId);
  return vistoriaId;
}

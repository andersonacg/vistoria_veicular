import { supabase } from '../config/supabase';
import { DadosFormulario, FotosVistoria } from '../types';

function gerarId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

async function uploadFoto(localUri: string, caminho: string): Promise<string> {
  const resposta = await fetch(localUri);
  const blob = await resposta.blob();

  const { error } = await supabase.storage
    .from('vistorias')
    .upload(caminho, blob, { contentType: 'image/jpeg', upsert: true });

  if (error) throw new Error(`Erro ao enviar foto: ${error.message}`);

  const { data } = supabase.storage.from('vistorias').getPublicUrl(caminho);
  return data.publicUrl;
}

export async function salvarVistoria(
  dados: DadosFormulario,
  inspetorId: string
): Promise<string> {
  const vistoriaId = gerarId();
  const pasta = `${inspetorId}/${vistoriaId}`;

  // Upload das 5 fotos obrigatórias em paralelo
  const entradas = Object.entries(dados.fotos) as [keyof FotosVistoria, string | null][];
  const uploads = await Promise.all(
    entradas.map(async ([chave, uri]) => {
      if (!uri) return [chave, null] as const;
      const url = await uploadFoto(uri, `${pasta}/fotos/${chave}.jpg`);
      return [chave, url] as const;
    })
  );
  const fotosUrls = Object.fromEntries(uploads) as FotosVistoria;

  // Upload da foto do chassi (opcional)
  let urlChassi: string | null = null;
  if (dados.foto_chassi) {
    urlChassi = await uploadFoto(dados.foto_chassi, `${pasta}/chassi.jpg`);
  }

  // Salvar registro no banco
  // A assinatura (base64 PNG) é salva diretamente como texto — tamanho típico < 30 KB
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

  if (error) throw new Error(`Erro ao salvar vistoria: ${error.message}`);

  return vistoriaId;
}

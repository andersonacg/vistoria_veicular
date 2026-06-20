-- Bucket para arquivos de vistoria (fotos e chassi)
-- Público para simplicidade no MVP — caminhos são UUIDs não-adivinháveis
insert into storage.buckets (id, name, public)
values ('vistorias', 'vistorias', true);

-- Inspetores autenticados fazem upload apenas na própria pasta
-- Estrutura: {inspetor_id}/{vistoria_id}/...
create policy "inspetores upload própria pasta"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'vistorias'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Inspetores podem sobrescrever/deletar próprios arquivos
create policy "inspetores update própria pasta"
on storage.objects for update to authenticated
using (
  bucket_id = 'vistorias'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "inspetores delete própria pasta"
on storage.objects for delete to authenticated
using (
  bucket_id = 'vistorias'
  and (storage.foldername(name))[1] = auth.uid()::text
);

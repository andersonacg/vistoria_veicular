-- Recria as policies de Storage usando LIKE em vez de foldername()
-- foldername() pode retornar índice inesperado dependendo da versão do Supabase

drop policy if exists "inspetores upload própria pasta" on storage.objects;
drop policy if exists "inspetores update própria pasta" on storage.objects;
drop policy if exists "inspetores delete própria pasta" on storage.objects;

-- INSERT: usuário autenticado só faz upload dentro de sua própria pasta raiz
create policy "inspetores upload própria pasta"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'vistorias'
  and name like auth.uid()::text || '/%'
);

-- UPDATE: mesma regra
create policy "inspetores update própria pasta"
on storage.objects for update to authenticated
using (
  bucket_id = 'vistorias'
  and name like auth.uid()::text || '/%'
);

-- DELETE: mesma regra
create policy "inspetores delete própria pasta"
on storage.objects for delete to authenticated
using (
  bucket_id = 'vistorias'
  and name like auth.uid()::text || '/%'
);

-- SELECT público (bucket já é public=true, mas a policy garante leitura via API)
create policy "leitura pública vistorias"
on storage.objects for select to public
using (bucket_id = 'vistorias');

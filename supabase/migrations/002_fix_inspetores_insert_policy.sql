-- Permite que o usuário recém-cadastrado insira seu próprio registro
-- A checagem garante que o id do registro bate com o uid do usuário autenticado
create policy "inspetor cria próprio perfil"
  on inspetores for insert
  with check (id = auth.uid());

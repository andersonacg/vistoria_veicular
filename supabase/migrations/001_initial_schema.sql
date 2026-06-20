-- ============================================================
-- Enum: status da vistoria
-- ============================================================
create type status_vistoria as enum ('pendente', 'em_andamento', 'concluida');

-- ============================================================
-- Tabela: inspetores
-- Vinculada ao sistema de autenticação do Supabase (auth.users)
-- ============================================================
create table inspetores (
  id         uuid        primary key references auth.users(id) on delete cascade,
  nome       text        not null,
  email      text        not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Tabela: vistorias
-- ============================================================
create table vistorias (
  id          uuid            primary key default gen_random_uuid(),

  -- Dados do veículo (MVP)
  placa       text            not null,
  modelo      text            not null,
  marca       text            not null,
  ano         integer         not null check (ano >= 1900 and ano <= 2100),

  -- Identificação do inspetor
  inspetor_id uuid            not null references inspetores(id) on delete restrict,
  data        date            not null default current_date,
  status      status_vistoria not null default 'pendente',

  -- Checklist estética: cada item é 'ok' | 'avaria'
  -- Itens: lataria, vidros, farois, para_brisas, para_choques
  checklist_estetica jsonb not null default '{
    "lataria":      null,
    "vidros":       null,
    "farois":       null,
    "para_brisas":  null,
    "para_choques": null
  }',

  -- Checklist mecânica: cada item é 'ok' | 'avaria'
  -- Itens: pneus, estepe, oleo, freios, suspensao
  checklist_mecanica jsonb not null default '{
    "pneus":     null,
    "estepe":    null,
    "oleo":      null,
    "freios":    null,
    "suspensao": null
  }',

  -- Fotos obrigatórias nomeadas
  fotos jsonb not null default '{
    "frente":           null,
    "traseira":         null,
    "lateral_esquerda": null,
    "lateral_direita":  null,
    "motor":            null
  }',

  -- Foto do chassi (separada)
  foto_chassi text,

  -- Assinatura digital (URL ou base64)
  assinatura  text,

  observacoes text        not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Índices para buscas comuns
create index vistorias_inspetor_id_idx on vistorias(inspetor_id);
create index vistorias_placa_idx       on vistorias(placa);
create index vistorias_status_idx      on vistorias(status);

-- Trigger para atualizar updated_at automaticamente
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger vistorias_updated_at
  before update on vistorias
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- Cada inspetor só acessa seus próprios dados
-- ============================================================
alter table inspetores enable row level security;
alter table vistorias   enable row level security;

-- Inspetor: lê e edita apenas o próprio perfil
create policy "inspetor lê próprio perfil"
  on inspetores for select
  using (id = auth.uid());

create policy "inspetor atualiza próprio perfil"
  on inspetores for update
  using (id = auth.uid());

-- Vistorias: inspetor acessa apenas as suas
create policy "inspetor lê próprias vistorias"
  on vistorias for select
  using (inspetor_id = auth.uid());

create policy "inspetor cria vistoria"
  on vistorias for insert
  with check (inspetor_id = auth.uid());

create policy "inspetor edita próprias vistorias"
  on vistorias for update
  using (inspetor_id = auth.uid());

create policy "inspetor exclui próprias vistorias"
  on vistorias for delete
  using (inspetor_id = auth.uid());

-- Tabela de Clientes
create table if not exists clientes (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  endereco text,
  cidade text,
  estado text,
  contato text,
  email text,
  cnpj text,
  inscricao_municipal text,
  segmento text,
  regime_tributario text,
  porte text,
  origem text,
  created_at timestamp with time zone default now()
);

-- Tabela de Serviços
create table if not exists servicos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  categoria text,
  unidade text,
  created_at timestamp with time zone default now()
);

-- Permitir acesso público (ajuste conforme sua política de segurança)
alter table clientes enable row level security;
alter table servicos enable row level security;

create policy "allow all" on clientes for all using (true) with check (true);
create policy "allow all" on servicos for all using (true) with check (true);

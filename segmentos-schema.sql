create table if not exists segmentos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  pai_id uuid references segmentos(id) on delete cascade,
  created_at timestamp with time zone default now()
);

alter table segmentos enable row level security;
create policy "allow all" on segmentos for all using (true) with check (true);

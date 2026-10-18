-- Salut i seny · estructura de la base de dades (Supabase / PostgreSQL)
-- Executa-ho una sola vegada a: Supabase → SQL Editor → New query → Run

-- Una fila per usuari i apartat (pes, tensio, nutricio, aliments, config...), amb les dades en JSON.
create table if not exists public.user_docs (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  doc        text        not null,
  v          jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, doc)
);

-- Seguretat: cada usuari només pot veure i modificar les seves pròpies dades.
alter table public.user_docs enable row level security;

drop policy if exists "llegir les meves dades"      on public.user_docs;
drop policy if exists "crear les meves dades"       on public.user_docs;
drop policy if exists "actualitzar les meves dades" on public.user_docs;
drop policy if exists "esborrar les meves dades"    on public.user_docs;

create policy "llegir les meves dades"      on public.user_docs for select using (auth.uid() = user_id);
create policy "crear les meves dades"       on public.user_docs for insert with check (auth.uid() = user_id);
create policy "actualitzar les meves dades" on public.user_docs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "esborrar les meves dades"    on public.user_docs for delete using (auth.uid() = user_id);

-- Sincronització en temps real entre dispositius (mòbil ↔ ordinador).
alter publication supabase_realtime add table public.user_docs;

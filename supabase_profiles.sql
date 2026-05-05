-- Tabela de perfis de usuários (vinculada ao Firebase Auth)
-- Execute no painel Supabase: SQL Editor → New Query → Cole e Execute

create table if not exists profiles (
  id              uuid primary key default gen_random_uuid(),
  firebase_uid    text unique not null,
  email           text not null,
  name            text,
  phone           text,
  role            text not null default 'customer'
                    check (role in ('admin', 'production', 'delivery', 'customer')),
  created_at      timestamptz default now()
);

-- RLS: usuário só lê/edita o próprio perfil; service_role tem acesso total
alter table profiles enable row level security;

create policy "profiles: usuário lê o próprio" on profiles
  for select using (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "profiles: usuário insere o próprio" on profiles
  for insert with check (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Inserir admin principal (substitua se já tiver feito login e tiver o firebase_uid)
-- insert into profiles (firebase_uid, email, role, name)
-- values ('SEU_FIREBASE_UID_AQUI', 'elispethke@gmail.com', 'admin', 'Admin');

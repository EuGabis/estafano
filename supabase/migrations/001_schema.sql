-- Extensão para gen_random_uuid()
create extension if not exists pgcrypto;

create table if not exists room_types (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  slug        text not null unique,
  descricao   text not null default '',
  capacidade  int  not null,
  tamanho_m2  int  not null,
  amenidades  text[] not null default '{}',
  fotos       text[] not null default '{}',
  preco_base  numeric(10,2) not null
);

create table if not exists reservations (
  id                 uuid primary key default gen_random_uuid(),
  codigo             text not null unique,
  room_type_id       uuid not null references room_types(id),
  checkin            date not null,
  checkout           date not null,
  noites             int  not null,
  hospedes           int  not null,
  total              numeric(10,2) not null,
  guest_nome         text not null,
  guest_email        text not null,
  guest_telefone     text not null,
  guest_observacoes  text,
  status             text not null default 'pendente'
                       check (status in ('pendente','confirmada','cancelada')),
  criado_em          timestamptz not null default now(),
  check (checkout > checkin)
);

create index if not exists idx_reservations_status  on reservations(status);
create index if not exists idx_reservations_checkin on reservations(checkin);
create index if not exists idx_reservations_email   on reservations(guest_email);
create index if not exists idx_reservations_criado  on reservations(criado_em desc);

create table if not exists day_overrides (
  room_type_id uuid not null references room_types(id),
  date         date not null,
  blocked      boolean not null default false,
  price        numeric(10,2),
  primary key (room_type_id, date)
);

create table if not exists contact_notes (
  id        uuid primary key default gen_random_uuid(),
  email     text not null,
  nota      text not null,
  autor     text,
  criado_em timestamptz not null default now()
);
create index if not exists idx_contact_notes_email on contact_notes(email);

-- RLS ligado em tudo (sem política = negado por padrão)
alter table room_types    enable row level security;
alter table reservations  enable row level security;
alter table day_overrides enable row level security;
alter table contact_notes enable row level security;

# Backend Supabase + Migração do Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar o sistema de reservas do site (localStorage) para um banco Supabase compartilhado, com RPCs seguras para o wizard público e Supabase Auth para o admin — deixando o banco pronto para o CRM ler em tempo real.

**Architecture:** Postgres no Supabase é a fonte única de verdade. O wizard público chama funções `SECURITY DEFINER` (`search_availability`, `create_reservation`, `get_reservation_by_codigo`) com a chave `anon`, sem SELECT direto nas tabelas. Admin do site autentica via Supabase Auth (papel `authenticated`), habilitado por RLS. `service_role` só roda em scripts SQL locais.

**Tech Stack:** Next.js 15, TypeScript, `@supabase/supabase-js` v2, Postgres/Supabase, Vitest.

## Global Constraints

- **Sem segredos no Git.** `service_role`, senha do banco e connection string só em `.env.local` (já no `.gitignore` via `.env*.local`). Nunca com prefixo `NEXT_PUBLIC_`. Nunca em arquivo SQL commitado.
- **No browser só a `anon` key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`), protegida por RLS.
- Interface pública de `src/lib/booking/api.ts` mantém as MESMAS assinaturas de função (páginas do site não mudam).
- Node/TS: `strict` TypeScript já ativo (`tsconfig.json`). Preservar `output: "export"` opcional (via `STATIC_EXPORT`).
- Nomes de coluna em snake_case; tipos TS em camelCase — mapear na camada de acesso.
- Testes com `npm test` (Vitest) devem continuar passando.

---

## File Structure

```
supabase/
├── migrations/
│   ├── 001_schema.sql         # tabelas + índices + enable RLS
│   ├── 002_rpc.sql            # funções SECURITY DEFINER
│   └── 003_policies.sql       # políticas RLS
├── seed.sql                    # room_types iniciais
└── README.md                   # como aplicar (usa .env.local, sem segredos)

src/lib/supabase/
└── client.ts                   # browser client (anon key)

src/lib/booking/
├── api.ts                      # REIMPLEMENTADO contra Supabase (mesmas assinaturas)
├── mappers.ts                  # NOVO: snake_case row <-> camelCase tipo
├── admin-auth.ts               # REESCRITO: Supabase Auth
├── persistence.ts              # REMOVIDO
├── seed.ts                     # REMOVIDO (vira supabase/seed.sql)
├── store.ts                    # MANTIDO (lógica pura, tests)
├── dates.ts / format.ts        # MANTIDOS
└── types.ts                    # MANTIDO (+ tipo de linha do banco se útil)

.env.local                      # NÃO commitado — credenciais reais
.env.example                    # commitado — só nomes das variáveis
```

---

## FASE 1 — Fundação Supabase

### Task 1: Dependência, env e client do Supabase

**Files:**
- Modify: `package.json` (adiciona `@supabase/supabase-js`)
- Create: `.env.example`
- Create (local, não commitado): `.env.local`
- Create: `src/lib/supabase/client.ts`

**Interfaces:**
- Produces: `supabase` (SupabaseClient) exportado de `src/lib/supabase/client.ts`.

- [ ] **Step 1: Instalar dependência**

Run:
```bash
npm install @supabase/supabase-js@^2
```
Expected: `package.json` passa a listar `@supabase/supabase-js` em `dependencies`.

- [ ] **Step 2: Criar `.env.example` (commitado, SEM valores)**

```bash
# Supabase (o site usa apenas a anon key no browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Só para scripts locais de migração/seed (NUNCA no browser, NUNCA commitar valores):
# SUPABASE_DB_URL=postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres
# SUPABASE_SERVICE_ROLE=...
```

- [ ] **Step 3: Criar `.env.local` (NÃO commitado) com os valores reais**

Preencher `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`, `SUPABASE_SERVICE_ROLE` com as credenciais do projeto `estefano_`. Confirmar que `git status` NÃO lista `.env.local`.

Run:
```bash
git check-ignore .env.local
```
Expected: imprime `.env.local` (ou seja, está ignorado).

- [ ] **Step 4: Criar o browser client**

`src/lib/supabase/client.ts`:
```ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (ver .env.example)",
  );
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .env.example src/lib/supabase/client.ts
git commit -m "feat(site): adiciona supabase-js e browser client (anon)"
```

---

### Task 2: Migração SQL — schema e índices

**Files:**
- Create: `supabase/migrations/001_schema.sql`

**Interfaces:**
- Produces: tabelas `room_types`, `reservations`, `day_overrides`, `contact_notes` com RLS habilitado (sem políticas ainda — nada acessível até a Task 4).

- [ ] **Step 1: Escrever `supabase/migrations/001_schema.sql`**

```sql
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
```

- [ ] **Step 2: Commit** (aplicação no banco acontece na Task 5)

```bash
git add supabase/migrations/001_schema.sql
git commit -m "feat(db): schema de reservas (tabelas, índices, RLS on)"
```

---

### Task 3: Migração SQL — RPCs seguras

**Files:**
- Create: `supabase/migrations/002_rpc.sql`

**Interfaces:**
- Produces (chamáveis via `supabase.rpc(...)`):
  - `search_availability(p_checkin date, p_checkout date, p_guests int)` → setof linhas `(room_type_id uuid, nome text, slug text, descricao text, capacidade int, tamanho_m2 int, amenidades text[], fotos text[], noites int, preco_noite numeric, total numeric)`
  - `create_reservation(p_room_type_id uuid, p_checkin date, p_checkout date, p_guests int, p_nome text, p_email text, p_telefone text, p_observacoes text)` → linha de `reservations`
  - `get_reservation_by_codigo(p_codigo text)` → linha de `reservations`

- [ ] **Step 1: Escrever `supabase/migrations/002_rpc.sql`**

A lógica replica `store.ts`/`dates.ts`: um quarto está disponível se não há override `blocked` e nenhuma reserva não-cancelada sobrepondo o intervalo `[checkin, checkout)`; o preço da noite usa `day_overrides.price` quando existir, senão `preco_base`.

```sql
-- Disponibilidade: retorna só vagas/preço, nunca PII de hóspedes.
create or replace function search_availability(
  p_checkin date, p_checkout date, p_guests int
) returns table (
  room_type_id uuid, nome text, slug text, descricao text,
  capacidade int, tamanho_m2 int, amenidades text[], fotos text[],
  noites int, preco_noite numeric, total numeric
)
language sql
security definer
set search_path = public
as $$
  with rt as (
    select * from room_types r
    where r.capacidade >= p_guests
      and not exists (
        select 1 from day_overrides o
        where o.room_type_id = r.id and o.blocked
          and o.date >= p_checkin and o.date < p_checkout
      )
      and not exists (
        select 1 from reservations rv
        where rv.room_type_id = r.id
          and rv.status <> 'cancelada'
          and rv.checkin < p_checkout and rv.checkout > p_checkin
      )
  ),
  dias as (
    select generate_series(p_checkin, p_checkout - 1, interval '1 day')::date as d
  ),
  precos as (
    select rt.id as room_type_id,
           sum(coalesce(o.price, rt.preco_base)) as total,
           (array_agg(coalesce(o.price, rt.preco_base) order by dias.d))[1] as preco_noite
    from rt cross join dias
    left join day_overrides o
      on o.room_type_id = rt.id and o.date = dias.d
    group by rt.id
  )
  select rt.id, rt.nome, rt.slug, rt.descricao, rt.capacidade, rt.tamanho_m2,
         rt.amenidades, rt.fotos,
         (p_checkout - p_checkin) as noites,
         p.preco_noite, p.total
  from rt join precos p on p.room_type_id = rt.id;
$$;

-- Criação: revalida vaga + recalcula preço no servidor + gera código único.
create or replace function create_reservation(
  p_room_type_id uuid, p_checkin date, p_checkout date, p_guests int,
  p_nome text, p_email text, p_telefone text, p_observacoes text
) returns reservations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rt room_types;
  v_total numeric;
  v_noites int := p_checkout - p_checkin;
  v_seq int;
  v_codigo text;
  v_row reservations;
begin
  if p_checkout <= p_checkin then
    raise exception 'Intervalo de datas inválido';
  end if;

  select * into v_rt from room_types where id = p_room_type_id;
  if not found then raise exception 'Tipo de quarto inexistente'; end if;
  if v_rt.capacidade < p_guests then raise exception 'Capacidade insuficiente'; end if;

  -- trava o quarto para evitar corrida de overbooking
  perform 1 from room_types where id = p_room_type_id for update;

  if exists (
    select 1 from day_overrides o
    where o.room_type_id = p_room_type_id and o.blocked
      and o.date >= p_checkin and o.date < p_checkout
  ) or exists (
    select 1 from reservations rv
    where rv.room_type_id = p_room_type_id and rv.status <> 'cancelada'
      and rv.checkin < p_checkout and rv.checkout > p_checkin
  ) then
    raise exception 'Quarto indisponível para o período';
  end if;

  select coalesce(sum(coalesce(o.price, v_rt.preco_base)), 0) into v_total
  from generate_series(p_checkin, p_checkout - 1, interval '1 day') g(d)
  left join day_overrides o
    on o.room_type_id = p_room_type_id and o.date = g.d::date;

  v_seq := (select count(*) + 1 from reservations);
  v_codigo := 'STF-' || lpad(v_seq::text, 4, '0');
  -- garante unicidade mesmo com cancelamentos/corridas
  while exists (select 1 from reservations where codigo = v_codigo) loop
    v_seq := v_seq + 1;
    v_codigo := 'STF-' || lpad(v_seq::text, 4, '0');
  end loop;

  insert into reservations (
    codigo, room_type_id, checkin, checkout, noites, hospedes, total,
    guest_nome, guest_email, guest_telefone, guest_observacoes, status
  ) values (
    v_codigo, p_room_type_id, p_checkin, p_checkout, v_noites, p_guests, v_total,
    p_nome, p_email, p_telefone, nullif(p_observacoes,''), 'pendente'
  ) returning * into v_row;

  return v_row;
end;
$$;

-- Consulta pública por código (não abre SELECT geral ao anon).
create or replace function get_reservation_by_codigo(p_codigo text)
returns reservations
language sql
security definer
set search_path = public
as $$
  select * from reservations where codigo = p_codigo;
$$;

-- Permissões de execução
grant execute on function search_availability(date,date,int) to anon, authenticated;
grant execute on function create_reservation(uuid,date,date,int,text,text,text,text) to anon, authenticated;
grant execute on function get_reservation_by_codigo(text) to anon, authenticated;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/002_rpc.sql
git commit -m "feat(db): RPCs search_availability / create_reservation / get_reservation_by_codigo"
```

---

### Task 4: Migração SQL — políticas RLS

**Files:**
- Create: `supabase/migrations/003_policies.sql`

**Interfaces:**
- Produces: `anon` só faz SELECT em `room_types`; `authenticated` tem acesso de gestão; `reservations` sem acesso direto ao `anon` (só via RPC).

- [ ] **Step 1: Escrever `supabase/migrations/003_policies.sql`**

```sql
-- room_types: catálogo público (leitura), gestão só logado
create policy room_types_select_all on room_types
  for select using (true);
create policy room_types_write_auth on room_types
  for all to authenticated using (true) with check (true);

-- reservations: NENHUM acesso direto ao anon (usa RPC). Logado gerencia.
create policy reservations_select_auth on reservations
  for select to authenticated using (true);
create policy reservations_update_auth on reservations
  for update to authenticated using (true) with check (true);
create policy reservations_insert_auth on reservations
  for insert to authenticated with check (true);

-- day_overrides: só logado (público enxerga via search_availability)
create policy overrides_all_auth on day_overrides
  for all to authenticated using (true) with check (true);

-- contact_notes: só logado
create policy notes_all_auth on contact_notes
  for all to authenticated using (true) with check (true);
```

Nota: as RPCs são `SECURITY DEFINER`, então funcionam para `anon` sem que ele tenha SELECT/INSERT nessas tabelas.

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/003_policies.sql
git commit -m "feat(db): políticas RLS (anon lê room_types; authenticated gerencia)"
```

---

### Task 5: Aplicar migrações + seed + Realtime no projeto Supabase

**Files:**
- Create: `supabase/seed.sql`
- Create: `supabase/README.md`

**Interfaces:**
- Produces: banco `estefano_` provisionado com schema, RPCs, políticas, 3 room_types e Realtime ligado em `reservations`.

- [ ] **Step 1: Escrever `supabase/seed.sql`** (a partir de `SEED_ROOM_TYPES`)

```sql
insert into room_types (nome, slug, descricao, capacidade, tamanho_m2, amenidades, fotos, preco_base) values
('Suíte Deluxe','suite-deluxe',
 'Conforto e tranquilidade com cama Queen Size, varanda e vista para a natureza.',
 2,20,
 array['Cama Queen Size','TV 32" com canais pagos','Varanda','Secador','Wi-Fi','Frigobar','Ar condicionado'],
 array['/images/hotel/deluxe-1.png','/images/hotel/deluxe-2.png','/images/hotel/deluxe-3.png'],
 420),
('Suíte Deluxe Família','suite-deluxe-familia',
 'Espaço para toda a família, com cama Queen Size e acomodação para até 4 pessoas.',
 4,23,
 array['Cama Queen Size','TV 32" com canais pagos','Wi-Fi','Secador','Frigobar','Ar condicionado'],
 array['/images/hotel/familia-1.png','/images/hotel/familia-2.png'],
 560),
('Suíte Standard','suite-standard',
 'Aconchego com cama de casal padrão, ideal para uma estadia prática e confortável.',
 3,20,
 array['Cama casal padrão','TV 32"','Wi-Fi','Secador'],
 array['/images/hotel/standard-1.png','/images/hotel/banheiro-1.png'],
 320)
on conflict (slug) do nothing;
```

- [ ] **Step 2: Escrever `supabase/README.md`** documentando como aplicar (usa `SUPABASE_DB_URL` do `.env.local`, sem expor valores):

````markdown
# Banco Supabase — como aplicar

As credenciais ficam em `.env.local` (não commitado). Nunca cole segredos aqui.

Aplicar migrações + seed (na ordem):

```bash
# carrega SUPABASE_DB_URL do .env.local
export $(grep -v '^#' ../.env.local | xargs)   # bash
psql "$SUPABASE_DB_URL" -f migrations/001_schema.sql
psql "$SUPABASE_DB_URL" -f migrations/002_rpc.sql
psql "$SUPABASE_DB_URL" -f migrations/003_policies.sql
psql "$SUPABASE_DB_URL" -f seed.sql
```

Alternativa sem `psql`: colar cada arquivo no SQL Editor do painel Supabase, na ordem.

Depois: em **Database → Replication**, adicionar a tabela `reservations` à publicação
`supabase_realtime` (ou rodar `alter publication supabase_realtime add table reservations;`).

Criar contas de staff em **Authentication → Users** (sem auto-cadastro público).
````

- [ ] **Step 3: Aplicar as migrações no banco**

Usando `SUPABASE_DB_URL` do `.env.local` (via `psql`) ou o SQL Editor do painel, rodar na ordem: `001_schema.sql`, `002_rpc.sql`, `003_policies.sql`, `seed.sql`.

Verificação:
```bash
psql "$SUPABASE_DB_URL" -c "select count(*) from room_types;"
```
Expected: `3`.

- [ ] **Step 4: Habilitar Realtime na tabela `reservations`**

```bash
psql "$SUPABASE_DB_URL" -c "alter publication supabase_realtime add table reservations;"
```
Expected: `ALTER PUBLICATION` (ou aviso de já existir).

- [ ] **Step 5: Criar 1 conta de staff de teste** no painel (Authentication → Users → Add user) para validar o admin/CRM depois.

- [ ] **Step 6: Commit**

```bash
git add supabase/seed.sql supabase/README.md
git commit -m "feat(db): seed de room_types + doc de aplicação"
```

---

## FASE 2 — Migração do site

### Task 6: Mappers snake_case ⇄ camelCase

**Files:**
- Create: `src/lib/booking/mappers.ts`
- Test: `src/lib/booking/mappers.test.ts`

**Interfaces:**
- Produces:
  - `rowToRoomType(row): RoomType`
  - `rowToReservation(row): Reservation`
  - `rowToOverride(row): DayOverride`

- [ ] **Step 1: Escrever teste `src/lib/booking/mappers.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { rowToRoomType, rowToReservation } from "./mappers";

describe("mappers", () => {
  it("mapeia room_type row -> RoomType", () => {
    const rt = rowToRoomType({
      id: "abc", nome: "Deluxe", slug: "deluxe", descricao: "x",
      capacidade: 2, tamanho_m2: 20, amenidades: ["Wi-Fi"], fotos: ["/a.png"],
      preco_base: "420.00",
    });
    expect(rt).toEqual({
      id: "abc", nome: "Deluxe", slug: "deluxe", descricao: "x",
      capacidade: 2, tamanhoM2: 20, amenidades: ["Wi-Fi"], fotos: ["/a.png"],
      precoBase: 420,
    });
  });

  it("mapeia reservation row -> Reservation", () => {
    const r = rowToReservation({
      id: "1", codigo: "STF-0001", room_type_id: "abc",
      checkin: "2026-07-10", checkout: "2026-07-12", noites: 2, hospedes: 2,
      total: "840.00", guest_nome: "Ana", guest_email: "a@x.com",
      guest_telefone: "11999", guest_observacoes: null, status: "pendente",
      criado_em: "2026-07-01T12:00:00Z",
    });
    expect(r.codigo).toBe("STF-0001");
    expect(r.guest).toEqual({ nome: "Ana", email: "a@x.com", telefone: "11999", observacoes: undefined });
    expect(r.total).toBe(840);
    expect(r.roomTypeId).toBe("abc");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test -- mappers`
Expected: FAIL (`rowToRoomType` não existe).

- [ ] **Step 3: Implementar `src/lib/booking/mappers.ts`**

```ts
import type { RoomType, Reservation, DayOverride } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToRoomType(row: any): RoomType {
  return {
    id: row.id,
    nome: row.nome,
    slug: row.slug,
    descricao: row.descricao,
    capacidade: row.capacidade,
    tamanhoM2: row.tamanho_m2,
    amenidades: row.amenidades ?? [],
    fotos: row.fotos ?? [],
    precoBase: Number(row.preco_base),
  };
}

export function rowToReservation(row: any): Reservation {
  return {
    id: row.id,
    codigo: row.codigo,
    roomTypeId: row.room_type_id,
    checkin: row.checkin,
    checkout: row.checkout,
    noites: row.noites,
    hospedes: row.hospedes,
    total: Number(row.total),
    guest: {
      nome: row.guest_nome,
      email: row.guest_email,
      telefone: row.guest_telefone,
      observacoes: row.guest_observacoes ?? undefined,
    },
    status: row.status,
    criadoEm: row.criado_em,
  };
}

export function rowToOverride(row: any): DayOverride {
  return {
    roomTypeId: row.room_type_id,
    date: row.date,
    blocked: row.blocked ?? undefined,
    price: row.price != null ? Number(row.price) : undefined,
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test -- mappers`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/mappers.ts src/lib/booking/mappers.test.ts
git commit -m "feat(site): mappers row<->tipo do booking"
```

---

### Task 7: Reimplementar `api.ts` — leitura de room types

**Files:**
- Modify: `src/lib/booking/api.ts` (substitui `getRoomTypes`, `getRoomType`; remove `delay`/`readState` desses)

**Interfaces:**
- Consumes: `supabase` (Task 1), `rowToRoomType` (Task 6).
- Produces: `getRoomTypes(): Promise<RoomType[]>`, `getRoomType(id): Promise<RoomType|null>` lendo do Supabase.

- [ ] **Step 1: Reescrever o topo de `api.ts` e as duas funções**

Substituir imports de `readState/writeState/store` progressivamente. Nesta task, mudar só o cabeçalho e as duas funções de leitura:

```ts
import type {
  AvailabilityResult, DayOverride, Guest, Reservation, ReservationStatus, RoomType, SearchParams,
} from "./types";
import { supabase } from "../supabase/client";
import { rowToRoomType, rowToReservation, rowToOverride } from "./mappers";

export async function getRoomTypes(): Promise<RoomType[]> {
  const { data, error } = await supabase.from("room_types").select("*").order("preco_base");
  if (error) throw error;
  return (data ?? []).map(rowToRoomType);
}

export async function getRoomType(id: string): Promise<RoomType | null> {
  const { data, error } = await supabase.from("room_types").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToRoomType(data) : null;
}
```

- [ ] **Step 2: Verificar type-check**

Run: `npx tsc --noEmit`
Expected: sem erros nessas funções (outras funções ainda usam `readState` até as próximas tasks — resolvidas em sequência).

- [ ] **Step 3: Commit**

```bash
git add src/lib/booking/api.ts
git commit -m "feat(site): getRoomTypes/getRoomType via Supabase"
```

---

### Task 8: `api.ts` — disponibilidade e criação via RPC

**Files:**
- Modify: `src/lib/booking/api.ts` (`searchAvailability`, `createReservation`)

**Interfaces:**
- Consumes: RPCs `search_availability`, `create_reservation` (Task 3).
- Produces: mesmas assinaturas de antes.

- [ ] **Step 1: Reescrever `searchAvailability`**

```ts
export async function searchAvailability(params: SearchParams): Promise<AvailabilityResult[]> {
  const { data, error } = await supabase.rpc("search_availability", {
    p_checkin: params.checkin, p_checkout: params.checkout, p_guests: params.guests,
  });
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    roomType: {
      id: row.room_type_id, nome: row.nome, slug: row.slug, descricao: row.descricao,
      capacidade: row.capacidade, tamanhoM2: row.tamanho_m2,
      amenidades: row.amenidades ?? [], fotos: row.fotos ?? [], precoBase: Number(row.preco_noite),
    },
    noites: row.noites, precoNoite: Number(row.preco_noite), total: Number(row.total),
  }));
}
```

- [ ] **Step 2: Reescrever `createReservation`**

```ts
export async function createReservation(input: {
  roomTypeId: string; params: SearchParams; guest: Guest;
}): Promise<Reservation> {
  const { data, error } = await supabase.rpc("create_reservation", {
    p_room_type_id: input.roomTypeId,
    p_checkin: input.params.checkin,
    p_checkout: input.params.checkout,
    p_guests: input.params.guests,
    p_nome: input.guest.nome,
    p_email: input.guest.email,
    p_telefone: input.guest.telefone,
    p_observacoes: input.guest.observacoes ?? "",
  });
  if (error) throw error;
  return rowToReservation(Array.isArray(data) ? data[0] : data);
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros nessas funções.

- [ ] **Step 4: Commit**

```bash
git add src/lib/booking/api.ts
git commit -m "feat(site): disponibilidade e criação de reserva via RPC"
```

---

### Task 9: `api.ts` — consulta por código, listagem e status

**Files:**
- Modify: `src/lib/booking/api.ts` (`getReservation`, `listReservations`, `updateReservationStatus`)

**Interfaces:**
- Consumes: RPC `get_reservation_by_codigo` (Task 3); políticas `authenticated` (Task 4).

- [ ] **Step 1: Reescrever as três funções**

```ts
export async function getReservation(codigo: string): Promise<Reservation | null> {
  const { data, error } = await supabase.rpc("get_reservation_by_codigo", { p_codigo: codigo });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row ? rowToReservation(row) : null;
}

export async function listReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations").select("*").order("criado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToReservation);
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
  const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
  if (error) throw error;
}
```

- [ ] **Step 2: Type-check** — `npx tsc --noEmit` sem erros nessas funções.

- [ ] **Step 3: Commit**

```bash
git add src/lib/booking/api.ts
git commit -m "feat(site): consulta por código, listagem e mudança de status via Supabase"
```

---

### Task 10: `api.ts` — room types (admin) e overrides

**Files:**
- Modify: `src/lib/booking/api.ts` (`upsertRoomType`, `deleteRoomType`, `listOverrides`, `setDayOverride`); remover `delay` e imports de `readState/writeState/store` remanescentes.

**Interfaces:**
- Consumes: políticas `authenticated`.

- [ ] **Step 1: Reescrever as quatro funções**

```ts
export async function upsertRoomType(rt: RoomType): Promise<void> {
  const row = {
    id: rt.id, nome: rt.nome, slug: rt.slug, descricao: rt.descricao,
    capacidade: rt.capacidade, tamanho_m2: rt.tamanhoM2,
    amenidades: rt.amenidades, fotos: rt.fotos, preco_base: rt.precoBase,
  };
  const { error } = await supabase.from("room_types").upsert(row);
  if (error) throw error;
}

export async function deleteRoomType(id: string): Promise<void> {
  const { error } = await supabase.from("room_types").delete().eq("id", id);
  if (error) throw error;
}

export async function listOverrides(roomTypeId: string): Promise<DayOverride[]> {
  const { data, error } = await supabase
    .from("day_overrides").select("*").eq("room_type_id", roomTypeId);
  if (error) throw error;
  return (data ?? []).map(rowToOverride);
}

export async function setDayOverride(ov: DayOverride): Promise<void> {
  const keep = ov.blocked || typeof ov.price === "number";
  if (!keep) {
    const { error } = await supabase.from("day_overrides")
      .delete().eq("room_type_id", ov.roomTypeId).eq("date", ov.date);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("day_overrides").upsert({
    room_type_id: ov.roomTypeId, date: ov.date,
    blocked: ov.blocked ?? false, price: ov.price ?? null,
  });
  if (error) throw error;
}
```

- [ ] **Step 2: Remover imports/código mortos** em `api.ts` (`delay`, `readState`, `writeState`, `computeAvailability`, `genCodigo`, `priceFor`, `nightsBetween` se não usados). `store.ts`/`dates.ts` continuam existindo para os testes puros.

- [ ] **Step 3: Type-check + testes**

Run: `npx tsc --noEmit && npm test`
Expected: type-check limpo; testes de `dates`/`store`/`format`/`mappers` passam.

- [ ] **Step 4: Commit**

```bash
git add src/lib/booking/api.ts
git commit -m "feat(site): admin de room types e overrides via Supabase"
```

---

### Task 11: Admin do site via Supabase Auth

**Files:**
- Rewrite: `src/lib/booking/admin-auth.ts`
- Modify: páginas/`components` de admin que chamam `login`/`isLogged`/`logout` (localizar com busca).

**Interfaces:**
- Produces (agora assíncrono):
  - `login(email: string, senha: string): Promise<boolean>`
  - `logout(): Promise<void>`
  - `getSession(): Promise<boolean>` (substitui `isLogged` síncrono)
  - `onAuthChange(cb: (logged: boolean) => void): () => void`

- [ ] **Step 1: Reescrever `admin-auth.ts`**

```ts
import { supabase } from "../supabase/client";

export async function login(email: string, senha: string): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  return !error;
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export function onAuthChange(cb: (logged: boolean) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(!!session));
  return () => data.subscription.unsubscribe();
}
```

- [ ] **Step 2: Localizar consumidores** do admin-auth:

Run: `git grep -n "admin-auth\|isLogged\|\blogin(\|\blogout(" src`
Ajustar cada chamada: `isLogged()` → `await getSession()` (ou estado via `onAuthChange`), formulário de login com campos email/senha, chamando `await login(email, senha)`. O componente de login vira client component com estado assíncrono.

- [ ] **Step 3: Rodar o site e validar login**

Run: `npm run dev` e testar `/` (wizard) + área admin com a conta de staff de teste (Task 5, Step 5).
Expected: wizard cria reserva; admin loga e lista reservas.

- [ ] **Step 4: Commit**

```bash
git add src/lib/booking/admin-auth.ts src/app src/components
git commit -m "feat(site): admin autenticado via Supabase Auth"
```

---

### Task 12: Remover localStorage e limpeza final

**Files:**
- Delete: `src/lib/booking/persistence.ts`, `src/lib/booking/seed.ts`
- Modify: qualquer import remanescente desses; `store.ts` se referenciar `seed.ts`.

**Interfaces:** nenhuma nova.

- [ ] **Step 1: Localizar referências**

Run: `git grep -n "persistence\|SEED_ROOM_TYPES\|readState\|writeState\|localStorage" src`
Expected: só sobra `admin-auth`? Não — admin-auth agora usa Supabase. Restos em `store.ts`/`seed.ts`.

- [ ] **Step 2: Remover `persistence.ts` e `seed.ts`**; se `store.ts` importa `SEED_ROOM_TYPES`, remover esse uso (a lógica pura não depende de seed).

Run: `git rm src/lib/booking/persistence.ts src/lib/booking/seed.ts`

- [ ] **Step 3: Type-check + testes + build**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: tudo verde; build gera sem erro.

- [ ] **Step 4: Teste e2e manual do fluxo completo**

- Wizard: buscar disponibilidade → escolher quarto → preencher hóspede → confirmar → ver código.
- Conferir no Supabase (`select * from reservations order by criado_em desc limit 1;`) que a linha existe com `total` correto.
- Admin: logar, ver a reserva, confirmar/cancelar, e conferir status no banco.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(site): remove localStorage; Supabase é a fonte única"
```

---

## Anti-overbooking (verificação da Fase 1)

Após aplicar as migrações, validar no SQL Editor:

```sql
-- cria uma reserva
select create_reservation((select id from room_types where slug='suite-deluxe'),
  '2026-08-01','2026-08-03',2,'Teste','t@x.com','11999','');
-- segunda reserva sobrepondo deve FALHAR com "Quarto indisponível para o período"
select create_reservation((select id from room_types where slug='suite-deluxe'),
  '2026-08-02','2026-08-04',2,'Teste2','t2@x.com','11999','');
```
Expected: a primeira cria; a segunda levanta exceção.

---

## Próximo plano

`estefano_crm` (Fase 3) é um app/repo separado e terá seu próprio plano
(`docs/superpowers/plans/YYYY-MM-DD-estefano-crm-app.md`), consumindo o mesmo banco:
Auth gate, Realtime em `reservations`, dashboard, kanban, contatos, calendário.

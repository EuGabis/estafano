# Backend Supabase + estefano_crm — Design

**Data:** 2026-07-01
**Status:** Aprovado para planejamento
**Repos envolvidos:** `estafano` (site) e `estefano_crm` (CRM, novo)

## Objetivo

Quando uma reserva cai no site do Hotel Stefano, ela deve aparecer em tempo real
no CRM (`estefano_crm`), com a equipe podendo gerenciá-la. Ambos compartilham o
mesmo banco Supabase — o mesmo padrão dos repos de referência do autor
(camping_reservas ↔ vapo_crm): banco Supabase compartilhado + Realtime.

## Regra inegociável de segredos

- Credenciais do Supabase (senha do banco, `service_role` key, connection string)
  **nunca** vão para o Git.
- `.env*.local` e `.env` já estão no `.gitignore` de ambos os repos.
- `service_role` **só** em scripts locais de migração/seed executados na máquina do
  dev. Nunca em código deployado, nunca em bundle de browser, nunca com prefixo
  `NEXT_PUBLIC_`.
- No browser só existe a `anon`/publishable key, protegida por RLS.

## Arquitetura

```
SITE (estafano)                 SUPABASE (Postgres)            CRM (estefano_crm)
─────────────────               ───────────────────            ──────────────────
Wizard público  ──RPC──►  ┌──────────────────────┐
(anon key)                │  room_types           │
                          │  reservations         │──Realtime──► Dashboard
Admin do site   ──auth──► │  day_overrides        │──Realtime──► Kanban 🔔
(Supabase Auth) ◄────────►│  contact_notes        │◄──update──── confirmar/cancelar
                          │  RPCs SECURITY DEFINER │
CRM staff       ──auth──► └──────────────────────┘
(Supabase Auth)
```

**Fonte única de verdade: Supabase.** O site deixa de usar localStorage; o CRM lê
do mesmo banco e escuta mudanças via Supabase Realtime.

## Schema do banco

Espelha os tipos existentes em `src/lib/booking/types.ts` (camelCase → snake_case).

### `room_types`
| coluna | tipo | notas |
|---|---|---|
| id | uuid PK default gen_random_uuid() | |
| nome | text not null | |
| slug | text not null unique | |
| descricao | text not null default '' | |
| capacidade | int not null | |
| tamanho_m2 | int not null | |
| amenidades | text[] not null default '{}' | |
| fotos | text[] not null default '{}' | |
| preco_base | numeric(10,2) not null | BRL/noite |

### `reservations`
| coluna | tipo | notas |
|---|---|---|
| id | uuid PK default gen_random_uuid() | |
| codigo | text not null unique | código de confirmação |
| room_type_id | uuid not null references room_types(id) | |
| checkin | date not null | |
| checkout | date not null | |
| noites | int not null | |
| hospedes | int not null | |
| total | numeric(10,2) not null | calculado no servidor |
| guest_nome | text not null | |
| guest_email | text not null | |
| guest_telefone | text not null | |
| guest_observacoes | text | opcional |
| status | text not null default 'pendente' | check in (pendente, confirmada, cancelada) |
| criado_em | timestamptz not null default now() | |

Índices: `(status)`, `(checkin)`, `(guest_email)`, `(criado_em desc)`.

### `day_overrides`
| coluna | tipo | notas |
|---|---|---|
| room_type_id | uuid references room_types(id) | |
| date | date | |
| blocked | boolean not null default false | |
| price | numeric(10,2) | override de preço |
| PK | (room_type_id, date) | |

### `contact_notes`
A "ficha do hóspede" é montada agrupando `reservations` por `guest_email`. Esta
tabela guarda anotações livres da equipe sobre um contato.

| coluna | tipo | notas |
|---|---|---|
| id | uuid PK default gen_random_uuid() | |
| email | text not null | chave lógica do contato |
| nota | text not null | |
| autor | text | email do staff (auth.jwt) |
| criado_em | timestamptz not null default now() | |

Índice: `(email)`.

## Funções RPC (SECURITY DEFINER)

Executáveis pelo papel `anon`. Validam no servidor e não vazam PII de terceiros.

### `search_availability(p_checkin date, p_checkout date, p_guests int)`
Retorna, por room_type com capacidade suficiente e sem bloqueio/reserva no
intervalo: `room_type_id, nome, slug, descricao, capacidade, tamanho_m2,
amenidades, fotos, noites, preco_noite, total`. **Não** retorna dados de hóspedes.
Preço considera `day_overrides.price` quando existir, senão `preco_base`.

### `create_reservation(p_room_type_id uuid, p_checkin date, p_checkout date, p_guests int, p_nome text, p_email text, p_telefone text, p_observacoes text)`
1. Revalida disponibilidade (evita overbooking em corrida).
2. Recalcula `total` no servidor (ignora qualquer valor vindo do client — evita
   adulteração de preço).
3. Gera `codigo` único.
4. Insere a reserva com `status='pendente'`.
5. Retorna a linha criada (inclui `codigo`).

Se indisponível, levanta exceção com mensagem tratável pelo wizard.

## RLS (Row Level Security)

Habilitado em todas as tabelas.

- **`room_types`**: `SELECT` liberado a `anon` (catálogo público). Mutação só
  `authenticated`.
- **`reservations`**: `anon` **não** faz SELECT/INSERT direto (só via RPC).
  `authenticated` tem SELECT/UPDATE total. INSERT direto: bloqueado (vai por RPC).
- **`day_overrides`**: SELECT/mutação só `authenticated`. Leitura pública apenas
  via `search_availability`.
- **`contact_notes`**: SELECT/INSERT/UPDATE/DELETE só `authenticated`.

A `search_availability` e `create_reservation` são `SECURITY DEFINER` (rodam como
owner), então funcionam para `anon` sem abrir as tabelas.

## Autenticação da equipe

- **Supabase Auth (email/senha)** para staff. As mesmas contas servem ao admin do
  site e ao CRM (mesmo projeto Supabase).
- Substitui o `src/lib/booking/admin-auth.ts` atual (usuário/senha hardcoded em
  localStorage — inseguro).
- Motivo de usar Auth em vez de `service_role` no servidor do site: o site pode ser
  exportado como estático (`STATIC_EXPORT=true` → `output: "export"`), onde não há
  route handlers/server actions para guardar um segredo. Auth funciona em qualquer
  host, sem segredo de servidor.
- Contas de staff são criadas manualmente pelo dev no painel do Supabase (sem
  auto-cadastro público).

## Migração do site (estafano)

Manter a interface pública de `src/lib/booking/api.ts` (mesmas assinaturas) para
minimizar mudança nas páginas:

| função | nova implementação |
|---|---|
| `getRoomTypes` / `getRoomType` | `SELECT` em `room_types` |
| `searchAvailability` | RPC `search_availability` |
| `createReservation` | RPC `create_reservation` |
| `getReservation(codigo)` | `SELECT` por `codigo` (via RPC, para não abrir a tabela ao anon) |
| `listReservations` | `SELECT` (authenticated) |
| `updateReservationStatus` | `UPDATE` (authenticated) |
| `upsertRoomType` / `deleteRoomType` | upsert/delete (authenticated) |
| `listOverrides` / `setDayOverride` | select/upsert/delete em `day_overrides` (authenticated) |

Remoções: `persistence.ts` (localStorage) e o estado em memória de `store.ts` (a
lógica pura de datas/preço em `dates.ts`, `format.ts` e as partes de cálculo de
`store.ts` permanecem e continuam cobertas por testes; a fonte de dados muda).
`seed.ts` vira um script SQL de seed de `room_types`.

Novo arquivo: `src/lib/supabase/client.ts` (browser client com anon key vinda de
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

Páginas de admin do site passam a exigir sessão Supabase Auth.

Config: adicionar dependência `@supabase/supabase-js`. `.env.local` (não commitado)
com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `.env.example`
(commitado) documenta os nomes das variáveis sem valores.

## CRM (estefano_crm) — app novo

Next.js 15 (App Router) + TypeScript + Tailwind (mesmo stack do site).

- **Auth gate**: todas as rotas exigem sessão Supabase Auth; senão redireciona ao
  login.
- **Realtime**: assina `postgres_changes` em `reservations`. Nova reserva →
  notificação ("reserva caiu!") + entra na coluna "pendente" sem refresh.
- **Dashboard**: reservas do mês, receita (soma de `total` confirmadas), ocupação,
  taxa de conversão (confirmadas / total).
- **Kanban/Lista**: colunas por status (pendente / confirmada / cancelada); ação de
  confirmar/cancelar faz `UPDATE` e reflete em todos os clientes via Realtime.
- **Contatos**: lista de hóspedes agrupada por `guest_email`, com histórico de
  reservas e `contact_notes`.
- **Calendário**: ocupação por quarto/data, com `day_overrides` (bloqueios e preços).

Estrutura sugerida:
```
estefano_crm/
├── src/app/(auth)/login/           # login
├── src/app/(app)/dashboard/        # métricas
├── src/app/(app)/reservas/         # kanban/lista
├── src/app/(app)/contatos/         # fichas
├── src/app/(app)/calendario/       # ocupação
├── src/components/                 # UI compartilhada
├── src/lib/supabase/               # client + queries + realtime
└── src/lib/types.ts                # tipos espelhando o schema
```

Variáveis: `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. `.env.example` commitado.

## Faseamento

1. **Fundação Supabase** — migração SQL (tabelas, índices, RLS, RPCs), seed de
   `room_types`, criar staff de teste, habilitar Realtime na tabela `reservations`.
   Scripts SQL versionados em `supabase/` no repo do site (sem segredos).
2. **Migração do site** — `@supabase/supabase-js`, `client.ts`, reimplementar
   `api.ts`, admin com Auth, remover localStorage. Testar wizard ponta a ponta.
3. **CRM** — scaffold do app, auth gate, Realtime, dashboard, kanban, contatos,
   calendário.

Cada fase testável antes da próxima.

## Testes

- Lógica pura de datas/preço (`dates.ts`, `format.ts`, cálculo em `store.ts`)
  continua com Vitest.
- RPCs testadas manualmente via SQL no painel + um teste de fluxo (criar reserva →
  aparece via listReservations).
- Anti-overbooking: teste de duas reservas concorrentes na mesma data/quarto.

## Riscos e decisões

- **Overbooking**: mitigado por `create_reservation` revalidar disponibilidade no
  banco dentro da transação.
- **PII**: `anon` nunca lê `reservations`; disponibilidade vem por RPC que só expõe
  vagas/preço.
- **Modelo de contatos**: começamos derivando de `reservations` por email
  (YAGNI) em vez de normalizar uma tabela `contacts`; `contact_notes` cobre a
  necessidade de anotações. Se surgir necessidade de merge/dedupe de contatos,
  vira um projeto próprio depois.
- **`getReservation` por código** exposto ao hóspede: fica via RPC que recebe o
  código e retorna só aquela reserva, sem abrir SELECT geral ao `anon`.

## Fora de escopo (por ora)

- Integração WhatsApp/Evolution API (existe nos repos de referência, mas não foi
  pedido aqui).
- Pagamento online (mantém pagamento na chegada).
- Auto-cadastro público de staff.
- Merge/dedupe avançado de contatos.

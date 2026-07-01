# Motor de Reservas Stefano — Front-end completo (Design)

**Data:** 2026-07-01
**Contexto:** substituir o motor de reservas externo (Cloudbeds) por um próprio,
melhor e integrado ao site da Família Stefano. Esta v1 entrega **apenas o
front-end completo** (dados mockados); o Supabase será plugado depois.

## Objetivo
Front-end completo de um motor de reservas de hotel, com fluxo do hóspede e
painel administrativo, visualmente superior ao Cloudbeds e alinhado à identidade
italiana elegante do site (bordô/dourado, serifada).

## Princípio de arquitetura (desacoplamento do backend)
Toda leitura/escrita passa por uma **camada de dados** em `src/lib/booking/`,
com funções assíncronas tipadas. Hoje a implementação é mockada + `localStorage`;
depois troca-se por Supabase sem alterar a UI.

Interface (`src/lib/booking/api.ts`), todas `async` retornando `Promise`:
- `getRoomTypes()` / `getRoomType(id)`
- `searchAvailability({ checkin, checkout, guests })` → quartos disponíveis + preço total
- `createReservation(input)` → `Reservation` com código
- `getReservation(code)`
- `listReservations(filters)` (admin)
- `updateReservationStatus(id, status)` (admin)
- `upsertRoomType(data)` / `deleteRoomType(id)` (admin)
- `getCalendar(roomTypeId, month)` / `setDayOverride(roomTypeId, date, { blocked, price })` (admin)

Implementação mock em `src/lib/booking/mock-store.ts`:
- Seed inicial dos 3 tipos de quarto (Deluxe, Deluxe Família, Standard) com as
  fotos e amenidades já existentes em `/public/images/hotel`.
- Persistência em `localStorage` (namespace `stefano.booking.*`); reservas
  criadas e edições do admin sobrevivem a reload.
- Disponibilidade calculada a partir de reservas + overrides de bloqueio.

## Modelos (TypeScript) — `src/lib/booking/types.ts`
- `RoomType { id, nome, slug, descricao, capacidade, tamanhoM2, amenidades[], fotos[], precoBase }`
- `DayOverride { roomTypeId, date, blocked?, price? }`
- `Reservation { id, codigo, roomTypeId, checkin, checkout, noites, hospedes, total, guest, status, criadoEm }`
- `Guest { nome, email, telefone, observacoes? }`
- `ReservationStatus = 'pendente' | 'confirmada' | 'cancelada'`

Utilidades de datas em `src/lib/booking/dates.ts` (noites, ranges, validação,
formatação pt-BR) — sem dependência externa.

## Fluxo do hóspede — `/hotel-stefano/reservas`
Wizard em 4 passos; estado principal via query params (compartilhável):
1. **Busca** — date range picker (chegada/partida), nº de hóspedes, código opcional. Valida datas (partida > chegada, não passado).
2. **Disponibilidade** (`?checkin=&checkout=&guests=`) — cards dos quartos disponíveis: foto, amenidades, preço/noite, nº de noites, total; botão "Selecionar".
3. **Dados do hóspede** — formulário (nome, e-mail, telefone, observações) + resumo lateral do quarto/datas/total.
4. **Confirmação** — código da reserva + resumo; aviso "pagamento na chegada".

Componentes: `DateRangePicker`, `GuestStepper` (nº hóspedes), `AvailabilityCard`,
`BookingSummary`, `BookingSteps` (indicador de passo).

## Painel admin — `/admin`
- **Login mock** (`/admin/login`) — gate visual apenas (usuário/senha fake); sem
  segurança real até o Supabase Auth. Estado em `localStorage`.
- **Reservas** (`/admin/reservas`) — tabela com filtros (status, datas, busca por
  código/nome), detalhe da reserva, alterar status.
- **Quartos** (`/admin/quartos`) — lista + formulário CRUD de tipos de quarto.
- **Disponibilidade & Tarifas** (`/admin/disponibilidade`) — calendário mensal por
  tipo de quarto; clicar num dia para bloquear ou definir preço.
- Layout admin próprio (`/admin/layout.tsx`): sidebar + topo, sem o header/footer do site.

## Visual
Reaproveita o design system do site (Tailwind: bordô/dourado/creme/carvão,
Playfair + Inter). Tom "app": cards limpos, calendário elegante, transições
suaves, estados de vazio/carregando. Claramente superior ao Cloudbeds.

## Integração
- A página `/hotel-stefano/reservas` atual (link Cloudbeds) é substituída pelo
  wizard. O link Cloudbeds é preservado como fallback secundário ("reservar por
  telefone/WhatsApp") no rodapé do passo 1.
- Tudo no repo atual; roda na Vercel (Next nativo, client components; sem DB).

## Fora de escopo (v1 / YAGNI)
- Integração real com Supabase (a camada fica pronta para plugar)
- Pagamento online (Pix/cartão)
- Envio real de e-mail/WhatsApp de confirmação
- Autenticação real / multiusuário / permissões
- Multi-idioma, multi-hotel, overbooking avançado, channel manager

## Critérios de sucesso
- Hóspede consegue: buscar datas → ver disponibilidade real (respeitando reservas
  e bloqueios do mock) → reservar → receber código; reserva persiste no reload.
- Admin consegue: ver/filtrar reservas e mudar status; criar/editar/excluir tipos
  de quarto; bloquear datas e ajustar preços num calendário — tudo refletindo no
  fluxo do hóspede.
- Trocar a implementação da camada de dados por Supabase não exige mudar a UI.

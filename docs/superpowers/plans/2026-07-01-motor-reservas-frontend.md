# Motor de Reservas Stefano — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Front-end completo de um motor de reservas de hotel (fluxo do hóspede + painel admin) com dados mockados persistidos em localStorage, desacoplado de backend, pronto para plugar Supabase depois.

**Architecture:** Camada de dados assíncrona e tipada em `src/lib/booking/` (implementação mock + localStorage) consumida por toda a UI. Fluxo do hóspede é um wizard de 4 passos em `/hotel-stefano/reservas`. Painel admin em `/admin` com layout próprio. Lógica pura (datas, disponibilidade, geração de código) coberta por testes Vitest; UI verificada por `next build` + checagem manual.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Vitest (só para lógica pura). Sem backend/DB nesta v1.

## Global Constraints

- Next.js `^15.1.12` (nunca voltar para versão vulnerável — CVE-2025-66478).
- Design system existente: cores Tailwind `bordo`/`dourado`/`creme`/`carvao`, fontes `font-serif` (Playfair) e `font-sans` (Inter) via `<link>` em `src/app/layout.tsx`.
- Todo acesso a dados passa pela interface `src/lib/booking/api.ts`. Nenhum componente de UI lê `localStorage` diretamente.
- Textos em PT-BR. Imagens de quarto reutilizam `/public/images/hotel/*`.
- Componentes que usam estado/browser levam `"use client"`. Persistência sob namespace `stefano.booking.*`.
- `next build` deve passar ao fim de cada tarefa de UI.

---

### Task 1: Tooling de testes (Vitest)

**Files:**
- Modify: `package.json` (scripts + devDeps)
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: comando `npm test` rodando Vitest em ambiente `node`.

- [ ] **Step 1: Instalar Vitest**

Run:
```bash
npm install -D vitest@2.1.8
```

- [ ] **Step 2: Criar `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: { environment: "node", include: ["src/**/*.test.ts"] },
  resolve: { alias: { "@": resolve(__dirname, "src") } },
});
```

- [ ] **Step 3: Adicionar script de teste**

Em `package.json`, no bloco `"scripts"`, acrescente:
```json
"test": "vitest run"
```

- [ ] **Step 4: Verificar que o runner sobe (sem testes ainda)**

Run: `npm test`
Expected: Vitest roda e reporta "No test files found" (exit 0) OU passa sem erros de config.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: adiciona Vitest para testes da lógica de reservas"
```

---

### Task 2: Tipos do domínio

**Files:**
- Create: `src/lib/booking/types.ts`

**Interfaces:**
- Produces:
  - `type ReservationStatus = "pendente" | "confirmada" | "cancelada"`
  - `interface RoomType { id: string; nome: string; slug: string; descricao: string; capacidade: number; tamanhoM2: number; amenidades: string[]; fotos: string[]; precoBase: number }`
  - `interface Guest { nome: string; email: string; telefone: string; observacoes?: string }`
  - `interface Reservation { id: string; codigo: string; roomTypeId: string; checkin: string; checkout: string; noites: number; hospedes: number; total: number; guest: Guest; status: ReservationStatus; criadoEm: string }`
  - `interface DayOverride { roomTypeId: string; date: string; blocked?: boolean; price?: number }`
  - `interface SearchParams { checkin: string; checkout: string; guests: number }`
  - `interface AvailabilityResult { roomType: RoomType; noites: number; precoNoite: number; total: number }`
  - Datas em ISO `YYYY-MM-DD` (string).

- [ ] **Step 1: Escrever `types.ts`**

```ts
export type ReservationStatus = "pendente" | "confirmada" | "cancelada";

export interface RoomType {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  capacidade: number;
  tamanhoM2: number;
  amenidades: string[];
  fotos: string[];
  precoBase: number; // BRL por noite
}

export interface Guest {
  nome: string;
  email: string;
  telefone: string;
  observacoes?: string;
}

export interface Reservation {
  id: string;
  codigo: string;
  roomTypeId: string;
  checkin: string; // YYYY-MM-DD
  checkout: string; // YYYY-MM-DD
  noites: number;
  hospedes: number;
  total: number;
  guest: Guest;
  status: ReservationStatus;
  criadoEm: string; // ISO
}

export interface DayOverride {
  roomTypeId: string;
  date: string; // YYYY-MM-DD
  blocked?: boolean;
  price?: number;
}

export interface SearchParams {
  checkin: string;
  checkout: string;
  guests: number;
}

export interface AvailabilityResult {
  roomType: RoomType;
  noites: number;
  precoNoite: number;
  total: number;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/booking/types.ts
git commit -m "feat(booking): tipos do domínio de reservas"
```

---

### Task 3: Utilitários de data (TDD)

**Files:**
- Create: `src/lib/booking/dates.ts`
- Test: `src/lib/booking/dates.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `toISO(d: Date): string`
  - `parseISO(s: string): Date`
  - `nightsBetween(checkin: string, checkout: string): number`
  - `eachDate(checkin: string, checkout: string): string[]` (datas de ocupação: inclui checkin, exclui checkout)
  - `isValidRange(checkin: string, checkout: string): boolean` (checkout > checkin)
  - `addDays(iso: string, n: number): string`
  - `formatBR(iso: string): string` → `"dd/mm/aaaa"`
  - `todayISO(): string`

- [ ] **Step 1: Escrever os testes**

```ts
import { describe, it, expect } from "vitest";
import {
  nightsBetween,
  eachDate,
  isValidRange,
  addDays,
  formatBR,
} from "./dates";

describe("dates", () => {
  it("conta noites entre duas datas", () => {
    expect(nightsBetween("2026-07-01", "2026-07-04")).toBe(3);
  });
  it("retorna 0 para datas iguais", () => {
    expect(nightsBetween("2026-07-01", "2026-07-01")).toBe(0);
  });
  it("eachDate inclui checkin e exclui checkout", () => {
    expect(eachDate("2026-07-01", "2026-07-03")).toEqual([
      "2026-07-01",
      "2026-07-02",
    ]);
  });
  it("valida intervalo (checkout deve ser depois)", () => {
    expect(isValidRange("2026-07-01", "2026-07-02")).toBe(true);
    expect(isValidRange("2026-07-02", "2026-07-01")).toBe(false);
    expect(isValidRange("2026-07-01", "2026-07-01")).toBe(false);
  });
  it("addDays soma dias corretamente atravessando o mês", () => {
    expect(addDays("2026-07-31", 1)).toBe("2026-08-01");
  });
  it("formata data em pt-BR", () => {
    expect(formatBR("2026-07-09")).toBe("09/07/2026");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL (módulo `./dates` não existe).

- [ ] **Step 3: Implementar `dates.ts`**

```ts
export function toISO(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function nightsBetween(checkin: string, checkout: string): number {
  const ms = parseISO(checkout).getTime() - parseISO(checkin).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function eachDate(checkin: string, checkout: string): string[] {
  const out: string[] = [];
  let cur = parseISO(checkin);
  const end = parseISO(checkout);
  while (cur.getTime() < end.getTime()) {
    out.push(toISO(cur));
    cur = new Date(cur.getTime() + 86_400_000);
  }
  return out;
}

export function isValidRange(checkin: string, checkout: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(checkin) &&
    /^\d{4}-\d{2}-\d{2}$/.test(checkout) &&
    parseISO(checkout).getTime() > parseISO(checkin).getTime()
  );
}

export function addDays(iso: string, n: number): string {
  return toISO(new Date(parseISO(iso).getTime() + n * 86_400_000));
}

export function formatBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function todayISO(): string {
  return toISO(new Date());
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS (6 testes).

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/dates.ts src/lib/booking/dates.test.ts
git commit -m "feat(booking): utilitários de data com testes"
```

---

### Task 4: Seed dos tipos de quarto

**Files:**
- Create: `src/lib/booking/seed.ts`

**Interfaces:**
- Consumes: `RoomType` (Task 2).
- Produces: `SEED_ROOM_TYPES: RoomType[]` (3 quartos com fotos de `/public/images/hotel`).

- [ ] **Step 1: Escrever `seed.ts`**

```ts
import type { RoomType } from "./types";

export const SEED_ROOM_TYPES: RoomType[] = [
  {
    id: "deluxe",
    nome: "Suíte Deluxe",
    slug: "suite-deluxe",
    descricao:
      "Conforto e tranquilidade com cama Queen Size, varanda e vista para a natureza.",
    capacidade: 2,
    tamanhoM2: 20,
    amenidades: [
      "Cama Queen Size",
      'TV 32" com canais pagos',
      "Varanda",
      "Secador",
      "Wi-Fi",
      "Frigobar",
      "Ar condicionado",
    ],
    fotos: ["/images/hotel/deluxe-1.png", "/images/hotel/deluxe-2.png", "/images/hotel/deluxe-3.png"],
    precoBase: 420,
  },
  {
    id: "deluxe-familia",
    nome: "Suíte Deluxe Família",
    slug: "suite-deluxe-familia",
    descricao:
      "Espaço para toda a família, com cama Queen Size e acomodação para até 4 pessoas.",
    capacidade: 4,
    tamanhoM2: 23,
    amenidades: [
      "Cama Queen Size",
      'TV 32" com canais pagos',
      "Wi-Fi",
      "Secador",
      "Frigobar",
      "Ar condicionado",
    ],
    fotos: ["/images/hotel/familia-1.png", "/images/hotel/familia-2.png"],
    precoBase: 560,
  },
  {
    id: "standard",
    nome: "Suíte Standard",
    slug: "suite-standard",
    descricao:
      "Aconchego com cama de casal padrão, ideal para uma estadia prática e confortável.",
    capacidade: 3,
    tamanhoM2: 20,
    amenidades: [
      "Cama casal padrão",
      'TV 32"',
      "Wi-Fi",
      "Secador",
    ],
    fotos: ["/images/hotel/standard-1.png", "/images/hotel/banheiro-1.png"],
    precoBase: 320,
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/booking/seed.ts
git commit -m "feat(booking): seed dos tipos de quarto"
```

---

### Task 5: Store mock + disponibilidade (TDD)

**Files:**
- Create: `src/lib/booking/store.ts`
- Test: `src/lib/booking/store.test.ts`

**Interfaces:**
- Consumes: `types.ts`, `dates.ts`, `seed.ts`.
- Produces (funções puras testáveis, sem browser):
  - `genCodigo(seq: number): string` → `"STF-0001"` (4 dígitos, zero-pad)
  - `isRoomAvailable(roomTypeId, checkin, checkout, reservations, overrides): boolean` (indisponível se qualquer data do range colide com reserva não-cancelada do mesmo quarto ou override `blocked`)
  - `priceFor(roomType, checkin, checkout, overrides): { precoNoite: number; total: number }` (usa override.price quando houver na 1ª noite; senão `precoBase`; total = soma por noite considerando overrides por dia)
  - `computeAvailability(params, roomTypes, reservations, overrides): AvailabilityResult[]` (só quartos com capacidade ≥ guests E disponíveis)

- [ ] **Step 1: Escrever os testes**

```ts
import { describe, it, expect } from "vitest";
import { genCodigo, isRoomAvailable, priceFor, computeAvailability } from "./store";
import { SEED_ROOM_TYPES } from "./seed";
import type { Reservation } from "./types";

const base: Omit<Reservation, "roomTypeId" | "checkin" | "checkout" | "status"> = {
  id: "r1", codigo: "STF-0001", noites: 1, hospedes: 2, total: 420,
  guest: { nome: "A", email: "a@a.com", telefone: "1" }, criadoEm: "2026-07-01T00:00:00Z",
};

describe("store", () => {
  it("gera código com zero-pad", () => {
    expect(genCodigo(1)).toBe("STF-0001");
    expect(genCodigo(42)).toBe("STF-0042");
  });

  it("quarto indisponível quando datas colidem com reserva ativa", () => {
    const res: Reservation[] = [{ ...base, roomTypeId: "deluxe", checkin: "2026-07-10", checkout: "2026-07-12", status: "confirmada" }];
    expect(isRoomAvailable("deluxe", "2026-07-11", "2026-07-13", res, [])).toBe(false);
    expect(isRoomAvailable("deluxe", "2026-07-12", "2026-07-14", res, [])).toBe(true); // checkout não ocupa
  });

  it("reserva cancelada não bloqueia", () => {
    const res: Reservation[] = [{ ...base, roomTypeId: "deluxe", checkin: "2026-07-10", checkout: "2026-07-12", status: "cancelada" }];
    expect(isRoomAvailable("deluxe", "2026-07-10", "2026-07-12", res, [])).toBe(true);
  });

  it("override blocked torna indisponível", () => {
    expect(isRoomAvailable("deluxe", "2026-07-10", "2026-07-11", [], [{ roomTypeId: "deluxe", date: "2026-07-10", blocked: true }])).toBe(false);
  });

  it("preço usa precoBase e soma por noite", () => {
    const rt = SEED_ROOM_TYPES[0]; // 420
    expect(priceFor(rt, "2026-07-10", "2026-07-13", [])).toEqual({ precoNoite: 420, total: 1260 });
  });

  it("override de preço afeta o total", () => {
    const rt = SEED_ROOM_TYPES[0];
    const ov = [{ roomTypeId: "deluxe", date: "2026-07-10", price: 500 }];
    expect(priceFor(rt, "2026-07-10", "2026-07-12", ov)).toEqual({ precoNoite: 500, total: 920 }); // 500 + 420
  });

  it("computeAvailability filtra por capacidade e disponibilidade", () => {
    const out = computeAvailability({ checkin: "2026-07-10", checkout: "2026-07-11", guests: 4 }, SEED_ROOM_TYPES, [], []);
    expect(out.map((r) => r.roomType.id)).toEqual(["deluxe-familia"]); // só cap>=4
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL (`./store` não existe).

- [ ] **Step 3: Implementar as funções puras em `store.ts`**

```ts
import type {
  AvailabilityResult, DayOverride, Reservation, RoomType, SearchParams,
} from "./types";
import { eachDate, nightsBetween } from "./dates";

export function genCodigo(seq: number): string {
  return `STF-${String(seq).padStart(4, "0")}`;
}

export function isRoomAvailable(
  roomTypeId: string, checkin: string, checkout: string,
  reservations: Reservation[], overrides: DayOverride[],
): boolean {
  const dias = new Set(eachDate(checkin, checkout));
  const blocked = overrides.some(
    (o) => o.roomTypeId === roomTypeId && o.blocked && dias.has(o.date),
  );
  if (blocked) return false;
  return !reservations.some(
    (r) =>
      r.roomTypeId === roomTypeId &&
      r.status !== "cancelada" &&
      eachDate(r.checkin, r.checkout).some((d) => dias.has(d)),
  );
}

export function priceFor(
  roomType: RoomType, checkin: string, checkout: string, overrides: DayOverride[],
): { precoNoite: number; total: number } {
  const dias = eachDate(checkin, checkout);
  const priceOf = (date: string) => {
    const ov = overrides.find(
      (o) => o.roomTypeId === roomType.id && o.date === date && typeof o.price === "number",
    );
    return ov?.price ?? roomType.precoBase;
  };
  const total = dias.reduce((sum, d) => sum + priceOf(d), 0);
  const precoNoite = dias.length ? priceOf(dias[0]) : roomType.precoBase;
  return { precoNoite, total };
}

export function computeAvailability(
  params: SearchParams, roomTypes: RoomType[],
  reservations: Reservation[], overrides: DayOverride[],
): AvailabilityResult[] {
  const noites = nightsBetween(params.checkin, params.checkout);
  return roomTypes
    .filter((rt) => rt.capacidade >= params.guests)
    .filter((rt) => isRoomAvailable(rt.id, params.checkin, params.checkout, reservations, overrides))
    .map((rt) => {
      const { precoNoite, total } = priceFor(rt, params.checkin, params.checkout, overrides);
      return { roomType: rt, noites, precoNoite, total };
    });
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS (todos os testes de `store` + `dates`).

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/store.ts src/lib/booking/store.test.ts
git commit -m "feat(booking): lógica de disponibilidade e preço com testes"
```

---

### Task 6: Persistência (localStorage) + API assíncrona

**Files:**
- Create: `src/lib/booking/persistence.ts`
- Create: `src/lib/booking/api.ts`

**Interfaces:**
- Consumes: `types.ts`, `seed.ts`, `store.ts`.
- Produces (API pública — única porta de entrada da UI), todas `async`:
  - `getRoomTypes(): Promise<RoomType[]>`
  - `getRoomType(id: string): Promise<RoomType | null>`
  - `searchAvailability(params: SearchParams): Promise<AvailabilityResult[]>`
  - `createReservation(input: { roomTypeId: string; params: SearchParams; guest: Guest }): Promise<Reservation>`
  - `getReservation(codigo: string): Promise<Reservation | null>`
  - `listReservations(): Promise<Reservation[]>`
  - `updateReservationStatus(id: string, status: ReservationStatus): Promise<void>`
  - `upsertRoomType(rt: RoomType): Promise<void>`
  - `deleteRoomType(id: string): Promise<void>`
  - `listOverrides(roomTypeId: string): Promise<DayOverride[]>`
  - `setDayOverride(ov: DayOverride): Promise<void>`
- Persistence helpers (internos): `readState()`, `writeState(state)`, chaves `stefano.booking.v1`.

- [ ] **Step 1: Escrever `persistence.ts`**

```ts
import type { DayOverride, Reservation, RoomType } from "./types";
import { SEED_ROOM_TYPES } from "./seed";

const KEY = "stefano.booking.v1";

export interface BookingState {
  roomTypes: RoomType[];
  reservations: Reservation[];
  overrides: DayOverride[];
  seq: number;
}

function defaultState(): BookingState {
  return { roomTypes: SEED_ROOM_TYPES, reservations: [], overrides: [], seq: 0 };
}

export function readState(): BookingState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<BookingState>;
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function writeState(state: BookingState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}
```

- [ ] **Step 2: Escrever `api.ts`**

```ts
import type {
  AvailabilityResult, DayOverride, Guest, Reservation, ReservationStatus, RoomType, SearchParams,
} from "./types";
import { readState, writeState } from "./persistence";
import { computeAvailability, genCodigo, priceFor } from "./store";
import { nightsBetween } from "./dates";

const delay = () => new Promise((r) => setTimeout(r, 120)); // simula rede

export async function getRoomTypes(): Promise<RoomType[]> {
  await delay();
  return readState().roomTypes;
}

export async function getRoomType(id: string): Promise<RoomType | null> {
  await delay();
  return readState().roomTypes.find((r) => r.id === id) ?? null;
}

export async function searchAvailability(params: SearchParams): Promise<AvailabilityResult[]> {
  await delay();
  const s = readState();
  return computeAvailability(params, s.roomTypes, s.reservations, s.overrides);
}

export async function createReservation(input: {
  roomTypeId: string; params: SearchParams; guest: Guest;
}): Promise<Reservation> {
  await delay();
  const s = readState();
  const rt = s.roomTypes.find((r) => r.id === input.roomTypeId);
  if (!rt) throw new Error("Tipo de quarto inexistente");
  const { total } = priceFor(rt, input.params.checkin, input.params.checkout, s.overrides);
  const seq = s.seq + 1;
  const reservation: Reservation = {
    id: `${Date.now()}-${seq}`,
    codigo: genCodigo(seq),
    roomTypeId: rt.id,
    checkin: input.params.checkin,
    checkout: input.params.checkout,
    noites: nightsBetween(input.params.checkin, input.params.checkout),
    hospedes: input.params.guests,
    total,
    guest: input.guest,
    status: "pendente",
    criadoEm: new Date().toISOString(),
  };
  writeState({ ...s, reservations: [...s.reservations, reservation], seq });
  return reservation;
}

export async function getReservation(codigo: string): Promise<Reservation | null> {
  await delay();
  return readState().reservations.find((r) => r.codigo === codigo) ?? null;
}

export async function listReservations(): Promise<Reservation[]> {
  await delay();
  return [...readState().reservations].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
  await delay();
  const s = readState();
  writeState({ ...s, reservations: s.reservations.map((r) => (r.id === id ? { ...r, status } : r)) });
}

export async function upsertRoomType(rt: RoomType): Promise<void> {
  await delay();
  const s = readState();
  const exists = s.roomTypes.some((r) => r.id === rt.id);
  writeState({
    ...s,
    roomTypes: exists ? s.roomTypes.map((r) => (r.id === rt.id ? rt : r)) : [...s.roomTypes, rt],
  });
}

export async function deleteRoomType(id: string): Promise<void> {
  await delay();
  const s = readState();
  writeState({ ...s, roomTypes: s.roomTypes.filter((r) => r.id !== id) });
}

export async function listOverrides(roomTypeId: string): Promise<DayOverride[]> {
  await delay();
  return readState().overrides.filter((o) => o.roomTypeId === roomTypeId);
}

export async function setDayOverride(ov: DayOverride): Promise<void> {
  await delay();
  const s = readState();
  const rest = s.overrides.filter((o) => !(o.roomTypeId === ov.roomTypeId && o.date === ov.date));
  const keep = ov.blocked || typeof ov.price === "number";
  writeState({ ...s, overrides: keep ? [...rest, ov] : rest });
}
```

- [ ] **Step 3: Verificar tipos/compilação**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/lib/booking/persistence.ts src/lib/booking/api.ts
git commit -m "feat(booking): persistência localStorage + API assíncrona"
```

---

### Task 7: Utilitário de formatação de moeda

**Files:**
- Create: `src/lib/booking/format.ts`
- Test: `src/lib/booking/format.test.ts`

**Interfaces:**
- Produces: `brl(value: number): string` → `"R$ 420,00"`.

- [ ] **Step 1: Teste**

```ts
import { describe, it, expect } from "vitest";
import { brl } from "./format";

describe("format", () => {
  it("formata BRL", () => {
    expect(brl(420).replace(/ /g, " ")).toBe("R$ 420,00");
    expect(brl(1260).replace(/ /g, " ")).toBe("R$ 1.260,00");
  });
});
```

- [ ] **Step 2: Ver falhar**

Run: `npm test`
Expected: FAIL.

- [ ] **Step 3: Implementar**

```ts
export function brl(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
```

- [ ] **Step 4: Ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/format.ts src/lib/booking/format.test.ts
git commit -m "feat(booking): formatação de moeda BRL"
```

---

### Task 8: Componentes primitivos do wizard

**Files:**
- Create: `src/components/booking/BookingSteps.tsx`
- Create: `src/components/booking/SearchForm.tsx`

**Interfaces:**
- Consumes: `api.ts` não; usa `dates.ts` (`todayISO`, `isValidRange`).
- Produces:
  - `BookingSteps({ current }: { current: 1 | 2 | 3 | 4 })` — indicador de passos.
  - `SearchForm({ initial?, onSearch }: { initial?: SearchParams; onSearch: (p: SearchParams) => void })` — client component com inputs de data (`type="date"`), stepper de hóspedes (1–6), validação (usa `isValidRange`, `min={todayISO()}`), botão "Pesquisar".

- [ ] **Step 1: Escrever `BookingSteps.tsx`**

```tsx
const steps = ["Busca", "Disponibilidade", "Seus dados", "Confirmação"];

export function BookingSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="mx-auto mb-10 flex max-w-2xl items-center justify-between">
      {steps.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4;
        const active = n === current;
        const done = n < current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm ${
                  active ? "border-dourado bg-dourado text-carvao" : done ? "border-dourado text-dourado" : "border-carvao/30 text-carvao/40"
                }`}
              >
                {n}
              </span>
              <span className={`mt-2 text-xs ${active ? "text-bordo" : "text-carvao/50"}`}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className={`mx-2 h-px flex-1 ${done ? "bg-dourado" : "bg-carvao/20"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 2: Escrever `SearchForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { SearchParams } from "@/lib/booking/types";
import { isValidRange, todayISO, addDays } from "@/lib/booking/dates";

export function SearchForm({
  initial, onSearch,
}: {
  initial?: SearchParams;
  onSearch: (p: SearchParams) => void;
}) {
  const [checkin, setCheckin] = useState(initial?.checkin ?? "");
  const [checkout, setCheckout] = useState(initial?.checkout ?? "");
  const [guests, setGuests] = useState(initial?.guests ?? 2);
  const [erro, setErro] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidRange(checkin, checkout)) {
      setErro("Selecione uma data de partida posterior à chegada.");
      return;
    }
    setErro("");
    onSearch({ checkin, checkout, guests });
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-dourado/30 bg-white p-5 shadow-sm md:flex md:items-end md:gap-4">
      <label className="mb-4 block flex-1 md:mb-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">Chegada</span>
        <input type="date" min={todayISO()} value={checkin}
          onChange={(e) => { setCheckin(e.target.value); if (checkout && e.target.value >= checkout) setCheckout(addDays(e.target.value, 1)); }}
          className="w-full rounded-sm border border-carvao/20 px-3 py-2.5 text-sm outline-none focus:border-dourado" />
      </label>
      <label className="mb-4 block flex-1 md:mb-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">Partida</span>
        <input type="date" min={checkin ? addDays(checkin, 1) : todayISO()} value={checkout}
          onChange={(e) => setCheckout(e.target.value)}
          className="w-full rounded-sm border border-carvao/20 px-3 py-2.5 text-sm outline-none focus:border-dourado" />
      </label>
      <label className="mb-4 block md:mb-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">Hóspedes</span>
        <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-sm border border-carvao/20 px-3 py-2.5 text-sm outline-none focus:border-dourado">
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "hóspede" : "hóspedes"}</option>)}
        </select>
      </label>
      <button type="submit" className="w-full rounded-sm bg-bordo px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-creme transition-colors hover:bg-bordo-light md:w-auto">
        Pesquisar
      </button>
      {erro && <p className="mt-3 w-full text-sm text-bordo md:mt-2">{erro}</p>}
    </form>
  );
}
```

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: PASS (componentes ainda não usados não quebram o build).

- [ ] **Step 4: Commit**

```bash
git add src/components/booking/BookingSteps.tsx src/components/booking/SearchForm.tsx
git commit -m "feat(booking): componentes SearchForm e BookingSteps"
```

---

### Task 9: Passo 1–2 do hóspede — Busca e Disponibilidade

**Files:**
- Modify: `src/app/hotel-stefano/reservas/page.tsx` (substitui conteúdo Cloudbeds pelo wizard passo 1 + resultados)
- Create: `src/components/booking/AvailabilityList.tsx`

**Interfaces:**
- Consumes: `SearchForm`, `BookingSteps`, `api.searchAvailability`, `brl`, `formatBR`.
- Produces: página cliente que, com query params `?checkin&checkout&guests`, chama `searchAvailability` e lista `AvailabilityCard`s; cada card leva para `/hotel-stefano/reservas/hospede?...&room=<id>`.

- [ ] **Step 1: Escrever `AvailabilityList.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AvailabilityResult, SearchParams } from "@/lib/booking/types";
import { searchAvailability } from "@/lib/booking/api";
import { brl } from "@/lib/booking/format";

export function AvailabilityList({ params }: { params: SearchParams }) {
  const [results, setResults] = useState<AvailabilityResult[] | null>(null);

  useEffect(() => {
    let alive = true;
    setResults(null);
    searchAvailability(params).then((r) => alive && setResults(r));
    return () => { alive = false; };
  }, [params]);

  if (results === null) return <p className="py-10 text-center text-carvao/60">Buscando disponibilidade…</p>;
  if (results.length === 0)
    return <p className="py-10 text-center text-carvao/70">Nenhum quarto disponível para as datas e hóspedes selecionados.</p>;

  const qs = new URLSearchParams({ checkin: params.checkin, checkout: params.checkout, guests: String(params.guests) });

  return (
    <div className="space-y-6">
      {results.map(({ roomType, noites, precoNoite, total }) => (
        <div key={roomType.id} className="grid overflow-hidden rounded-lg border border-dourado/25 bg-white shadow-sm md:grid-cols-[280px_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={roomType.fotos[0]} alt={roomType.nome} className="h-full min-h-[200px] w-full object-cover" />
          <div className="flex flex-col p-6">
            <h3 className="font-serif text-2xl text-bordo">{roomType.nome}</h3>
            <p className="mt-1 text-sm text-carvao/70">{roomType.descricao}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {roomType.amenidades.slice(0, 5).map((a) => (
                <li key={a} className="rounded-full border border-dourado/40 px-3 py-1 text-xs text-carvao/70">{a}</li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
              <div>
                <p className="text-sm text-carvao/60">{brl(precoNoite)} / noite · {noites} {noites === 1 ? "noite" : "noites"}</p>
                <p className="font-serif text-2xl text-bordo">{brl(total)}</p>
              </div>
              <Link href={`/hotel-stefano/reservas/hospede?${qs.toString()}&room=${roomType.id}`}
                className="rounded-sm bg-dourado px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-carvao transition-colors hover:bg-dourado-dark hover:text-creme">
                Selecionar
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Reescrever `reservas/page.tsx`**

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { SearchForm } from "@/components/booking/SearchForm";
import { AvailabilityList } from "@/components/booking/AvailabilityList";
import type { SearchParams } from "@/lib/booking/types";
import { isValidRange } from "@/lib/booking/dates";

export default function ReservasPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const checkin = sp.get("checkin") ?? "";
  const checkout = sp.get("checkout") ?? "";
  const guests = Number(sp.get("guests") ?? "2");
  const hasSearch = isValidRange(checkin, checkout);
  const params: SearchParams = { checkin, checkout, guests };

  const onSearch = (p: SearchParams) => {
    const qs = new URLSearchParams({ checkin: p.checkin, checkout: p.checkout, guests: String(p.guests) });
    router.push(`/hotel-stefano/reservas?${qs.toString()}`);
  };

  return (
    <>
      <Hero eyebrow="Reservas" title="Reserve sua estadia" subtitle="Disponibilidade em tempo real, direto com a Família Stefano." image="/images/hotel/home-5.jpg" height="short" />
      <Section>
        <BookingSteps current={hasSearch ? 2 : 1} />
        <div className="mx-auto max-w-4xl">
          <SearchForm initial={hasSearch ? params : undefined} onSearch={onSearch} />
          {hasSearch && (
            <div className="mt-10">
              <AvailabilityList params={params} />
            </div>
          )}
          {!hasSearch && (
            <p className="mt-6 text-center text-sm text-carvao/60">
              Prefere reservar por telefone?{" "}
              <a href="https://wa.me/551147141464" target="_blank" rel="noopener noreferrer" className="text-bordo underline">Fale no WhatsApp</a>.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 3: Envolver em Suspense (useSearchParams exige)**

Se o `next build` acusar erro de `useSearchParams` sem Suspense, edite `reservas/page.tsx` para exportar um wrapper:
```tsx
import { Suspense } from "react";
// ...renomeie a função para ReservasInner e adicione:
export default function ReservasPage() {
  return <Suspense fallback={null}><ReservasInner /></Suspense>;
}
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/hotel-stefano/reservas/page.tsx src/components/booking/AvailabilityList.tsx
git commit -m "feat(booking): passos de busca e disponibilidade do hóspede"
```

---

### Task 10: Passo 3–4 do hóspede — Dados e Confirmação

**Files:**
- Create: `src/app/hotel-stefano/reservas/hospede/page.tsx`
- Create: `src/app/hotel-stefano/reservas/confirmacao/page.tsx`

**Interfaces:**
- Consumes: `api.getRoomType`, `api.createReservation`, `api.getReservation`, `priceFor` indireto via total, `brl`, `formatBR`, `BookingSteps`.
- Produces: formulário do hóspede que cria a reserva e redireciona para `/hotel-stefano/reservas/confirmacao?codigo=STF-XXXX`.

- [ ] **Step 1: Escrever `hospede/page.tsx`**

```tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Section } from "@/components/Section";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { getRoomType, createReservation } from "@/lib/booking/api";
import type { RoomType } from "@/lib/booking/types";
import { nightsBetween } from "@/lib/booking/dates";
import { priceFor } from "@/lib/booking/store";
import { brl } from "@/lib/booking/format";

function HospedeInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const checkin = sp.get("checkin") ?? "";
  const checkout = sp.get("checkout") ?? "";
  const guests = Number(sp.get("guests") ?? "2");
  const roomId = sp.get("room") ?? "";

  const [rt, setRt] = useState<RoomType | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", observacoes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { getRoomType(roomId).then(setRt); }, [roomId]);

  if (!rt) return <Section><p className="text-center text-carvao/60">Carregando…</p></Section>;

  const noites = nightsBetween(checkin, checkout);
  const { total } = priceFor(rt, checkin, checkout, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const r = await createReservation({ roomTypeId: rt.id, params: { checkin, checkout, guests }, guest: form });
    router.push(`/hotel-stefano/reservas/confirmacao?codigo=${r.codigo}`);
  };

  return (
    <Section>
      <BookingSteps current={3} />
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className="space-y-4">
          <h2 className="font-serif text-2xl text-bordo">Seus dados</h2>
          {(["nome", "email", "telefone"] as const).map((f) => (
            <label key={f} className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">{f === "email" ? "E-mail" : f[0].toUpperCase() + f.slice(1)}</span>
              <input required type={f === "email" ? "email" : "text"} value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="w-full rounded-sm border border-carvao/20 px-4 py-2.5 text-sm outline-none focus:border-dourado" />
            </label>
          ))}
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">Observações</span>
            <textarea rows={3} value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              className="w-full rounded-sm border border-carvao/20 px-4 py-2.5 text-sm outline-none focus:border-dourado" />
          </label>
          <button type="submit" disabled={saving} className="rounded-sm bg-bordo px-8 py-3 text-xs font-semibold uppercase tracking-wider2 text-creme transition-colors hover:bg-bordo-light disabled:opacity-60">
            {saving ? "Confirmando…" : "Confirmar reserva"}
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-dourado/25 bg-white p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={rt.fotos[0]} alt={rt.nome} className="mb-4 aspect-[4/3] w-full rounded-sm object-cover" />
          <h3 className="font-serif text-xl text-bordo">{rt.nome}</h3>
          <dl className="mt-3 space-y-1 text-sm text-carvao/75">
            <div className="flex justify-between"><dt>Chegada</dt><dd>{checkin}</dd></div>
            <div className="flex justify-between"><dt>Partida</dt><dd>{checkout}</dd></div>
            <div className="flex justify-between"><dt>Noites</dt><dd>{noites}</dd></div>
            <div className="flex justify-between"><dt>Hóspedes</dt><dd>{guests}</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-carvao/10 pt-4 font-serif text-xl text-bordo">
            <span>Total</span><span>{brl(total)}</span>
          </div>
          <p className="mt-2 text-xs text-carvao/55">Pagamento na chegada.</p>
        </aside>
      </div>
    </Section>
  );
}

export default function HospedePage() {
  return <Suspense fallback={null}><HospedeInner /></Suspense>;
}
```

- [ ] **Step 2: Escrever `confirmacao/page.tsx`**

```tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/Section";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { getReservation } from "@/lib/booking/api";
import type { Reservation } from "@/lib/booking/types";
import { brl } from "@/lib/booking/format";
import { formatBR } from "@/lib/booking/dates";

function ConfirmacaoInner() {
  const codigo = useSearchParams().get("codigo") ?? "";
  const [r, setR] = useState<Reservation | null | undefined>(undefined);
  useEffect(() => { getReservation(codigo).then(setR); }, [codigo]);

  if (r === undefined) return <Section><p className="text-center text-carvao/60">Carregando…</p></Section>;
  if (r === null) return <Section><p className="text-center text-carvao/70">Reserva não encontrada.</p></Section>;

  return (
    <Section>
      <BookingSteps current={4} />
      <div className="mx-auto max-w-lg rounded-lg border border-dourado/30 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-dourado text-2xl text-dourado">✓</div>
        <h2 className="font-serif text-3xl text-bordo">Reserva confirmada!</h2>
        <p className="mt-2 text-sm text-carvao/70">Guarde o seu código de reserva:</p>
        <p className="my-4 font-serif text-2xl tracking-widest text-dourado-dark">{r.codigo}</p>
        <dl className="mt-4 space-y-1 text-left text-sm text-carvao/75">
          <div className="flex justify-between"><dt>Hóspede</dt><dd>{r.guest.nome}</dd></div>
          <div className="flex justify-between"><dt>Chegada</dt><dd>{formatBR(r.checkin)}</dd></div>
          <div className="flex justify-between"><dt>Partida</dt><dd>{formatBR(r.checkout)}</dd></div>
          <div className="flex justify-between"><dt>Noites</dt><dd>{r.noites}</dd></div>
          <div className="flex justify-between border-t border-carvao/10 pt-2 font-medium text-bordo"><dt>Total</dt><dd>{brl(r.total)}</dd></div>
        </dl>
        <p className="mt-4 text-xs text-carvao/55">Pagamento na chegada. Em breve entraremos em contato para confirmar os detalhes.</p>
        <Link href="/hotel-stefano" className="mt-6 inline-block rounded-sm border border-bordo px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-bordo hover:bg-bordo hover:text-creme">Voltar ao hotel</Link>
      </div>
    </Section>
  );
}

export default function ConfirmacaoPage() {
  return <Suspense fallback={null}><ConfirmacaoInner /></Suspense>;
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Verificação manual**

Run: `npm run dev`, acesse `/hotel-stefano/reservas`, busque datas futuras, selecione um quarto, preencha e confirme. Recarregue `/hotel-stefano/reservas/confirmacao?codigo=...` e veja que persiste.

- [ ] **Step 5: Commit**

```bash
git add src/app/hotel-stefano/reservas/hospede/page.tsx src/app/hotel-stefano/reservas/confirmacao/page.tsx
git commit -m "feat(booking): passos de dados do hóspede e confirmação"
```

---

### Task 11: Shell do admin + login mock

**Files:**
- Create: `src/lib/booking/admin-auth.ts`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/page.tsx` (redireciona para `/admin/reservas`)

**Interfaces:**
- Produces:
  - `isLogged(): boolean`, `login(user, pass): boolean` (aceita `admin`/`stefano`), `logout(): void` — via `localStorage` `stefano.booking.admin`.
  - Layout com sidebar (Reservas, Quartos, Disponibilidade) + botão sair; redireciona para `/admin/login` se não logado.

- [ ] **Step 1: `admin-auth.ts`**

```ts
const KEY = "stefano.booking.admin";

export function isLogged(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}
export function login(user: string, pass: string): boolean {
  const ok = user === "admin" && pass === "stefano";
  if (ok && typeof window !== "undefined") window.localStorage.setItem(KEY, "1");
  return ok;
}
export function logout(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}
```

- [ ] **Step 2: `admin/layout.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLogged, logout } from "@/lib/booking/admin-auth";

const nav = [
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/quartos", label: "Quartos" },
  { href: "/admin/disponibilidade", label: "Disponibilidade" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname !== "/admin/login" && !isLogged()) router.replace("/admin/login");
    else setReady(true);
  }, [pathname, router]);

  if (pathname === "/admin/login") return <div className="min-h-screen bg-creme">{children}</div>;
  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-creme">
      <aside className="hidden w-60 flex-col bg-bordo-dark text-creme md:flex">
        <div className="border-b border-creme/10 p-6 font-serif text-xl text-dourado">Stefano · Admin</div>
        <nav className="flex-1 p-4">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className={`block rounded-sm px-4 py-2.5 text-sm ${pathname.startsWith(n.href) ? "bg-dourado text-carvao" : "text-creme/80 hover:bg-creme/10"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => { logout(); router.replace("/admin/login"); }} className="m-4 rounded-sm border border-creme/20 px-4 py-2 text-xs uppercase tracking-wider2 text-creme/80 hover:bg-creme/10">Sair</button>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: `admin/login/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/booking/admin-auth";

export default function AdminLogin() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [erro, setErro] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(user, pass)) router.replace("/admin/reservas");
    else setErro("Credenciais inválidas.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-dourado/30 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl text-bordo">Painel Stefano</h1>
        <p className="mt-1 text-xs text-carvao/60">Acesso restrito. (demo: admin / stefano)</p>
        <label className="mt-6 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">Usuário</span>
          <input value={user} onChange={(e) => setUser(e.target.value)} className="w-full rounded-sm border border-carvao/20 px-4 py-2.5 text-sm outline-none focus:border-dourado" />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">Senha</span>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full rounded-sm border border-carvao/20 px-4 py-2.5 text-sm outline-none focus:border-dourado" />
        </label>
        {erro && <p className="mt-3 text-sm text-bordo">{erro}</p>}
        <button type="submit" className="mt-6 w-full rounded-sm bg-bordo px-6 py-3 text-xs font-semibold uppercase tracking-wider2 text-creme hover:bg-bordo-light">Entrar</button>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: `admin/page.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndex() {
  const router = useRouter();
  useEffect(() => { router.replace("/admin/reservas"); }, [router]);
  return null;
}
```

- [ ] **Step 5: Build + commit**

Run: `npm run build` (Expected: PASS)
```bash
git add src/lib/booking/admin-auth.ts src/app/admin
git commit -m "feat(admin): shell do painel + login mock"
```

---

### Task 12: Admin — Reservas

**Files:**
- Create: `src/app/admin/reservas/page.tsx`

**Interfaces:**
- Consumes: `api.listReservations`, `api.updateReservationStatus`, `api.getRoomTypes`, `brl`, `formatBR`.
- Produces: tabela de reservas com filtro por status e busca por código/nome; select para alterar status inline.

- [ ] **Step 1: Escrever a página**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { listReservations, updateReservationStatus, getRoomTypes } from "@/lib/booking/api";
import type { Reservation, ReservationStatus, RoomType } from "@/lib/booking/types";
import { brl } from "@/lib/booking/format";
import { formatBR } from "@/lib/booking/dates";

const STATUSES: ReservationStatus[] = ["pendente", "confirmada", "cancelada"];
const badge: Record<ReservationStatus, string> = {
  pendente: "bg-amber-100 text-amber-800",
  confirmada: "bg-green-100 text-green-800",
  cancelada: "bg-red-100 text-red-700",
};

export default function AdminReservas() {
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [filtro, setFiltro] = useState<ReservationStatus | "todas">("todas");
  const [busca, setBusca] = useState("");

  const load = () => listReservations().then(setReservas);
  useEffect(() => { load(); getRoomTypes().then(setRooms); }, []);

  const roomName = (id: string) => rooms.find((r) => r.id === id)?.nome ?? id;

  const filtradas = useMemo(
    () => reservas.filter((r) =>
      (filtro === "todas" || r.status === filtro) &&
      (busca === "" || r.codigo.toLowerCase().includes(busca.toLowerCase()) || r.guest.nome.toLowerCase().includes(busca.toLowerCase()))
    ),
    [reservas, filtro, busca],
  );

  const setStatus = async (id: string, status: ReservationStatus) => {
    await updateReservationStatus(id, status);
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-bordo">Reservas</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <select value={filtro} onChange={(e) => setFiltro(e.target.value as ReservationStatus | "todas")} className="rounded-sm border border-carvao/20 px-3 py-2 text-sm">
          <option value="todas">Todas</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="Buscar código ou nome" value={busca} onChange={(e) => setBusca(e.target.value)} className="flex-1 rounded-sm border border-carvao/20 px-3 py-2 text-sm" />
      </div>

      {filtradas.length === 0 ? (
        <p className="mt-10 text-carvao/60">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-dourado/20 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-creme text-xs uppercase tracking-wider text-carvao/60">
              <tr>{["Código", "Hóspede", "Quarto", "Check-in", "Check-out", "Total", "Status"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtradas.map((r) => (
                <tr key={r.id} className="border-t border-carvao/10">
                  <td className="px-4 py-3 font-medium text-bordo">{r.codigo}</td>
                  <td className="px-4 py-3">{r.guest.nome}<br /><span className="text-xs text-carvao/50">{r.guest.email}</span></td>
                  <td className="px-4 py-3">{roomName(r.roomTypeId)}</td>
                  <td className="px-4 py-3">{formatBR(r.checkin)}</td>
                  <td className="px-4 py-3">{formatBR(r.checkout)}</td>
                  <td className="px-4 py-3">{brl(r.total)}</td>
                  <td className="px-4 py-3">
                    <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value as ReservationStatus)} className={`rounded-full px-2 py-1 text-xs ${badge[r.status]}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Build + verificação manual**

Run: `npm run build` (PASS). Em dev, crie uma reserva no fluxo do hóspede e veja-a aparecer em `/admin/reservas`; mude o status e recarregue (persiste).

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/reservas/page.tsx
git commit -m "feat(admin): listagem e status de reservas"
```

---

### Task 13: Admin — Quartos (CRUD)

**Files:**
- Create: `src/app/admin/quartos/page.tsx`

**Interfaces:**
- Consumes: `api.getRoomTypes`, `api.upsertRoomType`, `api.deleteRoomType`, `brl`.
- Produces: lista de quartos + formulário (nome, descrição, capacidade, tamanho, preço base, amenidades como texto separado por vírgula, fotos como URLs por linha). Editar preenche o form; salvar faz upsert; excluir remove.

- [ ] **Step 1: Escrever a página**

```tsx
"use client";

import { useEffect, useState } from "react";
import { getRoomTypes, upsertRoomType, deleteRoomType } from "@/lib/booking/api";
import type { RoomType } from "@/lib/booking/types";
import { brl } from "@/lib/booking/format";

const vazio: RoomType = { id: "", nome: "", slug: "", descricao: "", capacidade: 2, tamanhoM2: 20, amenidades: [], fotos: [], precoBase: 300 };
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminQuartos() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [form, setForm] = useState<RoomType>(vazio);
  const [editing, setEditing] = useState(false);

  const load = () => getRoomTypes().then(setRooms);
  useEffect(() => { load(); }, []);

  const edit = (r: RoomType) => { setForm(r); setEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const reset = () => { setForm(vazio); setEditing(false); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.id || slugify(form.nome) || `quarto-${Date.now()}`;
    await upsertRoomType({ ...form, id, slug: slugify(form.nome) || id });
    reset(); load();
  };

  const remove = async (id: string) => { await deleteRoomType(id); load(); };

  return (
    <div>
      <h1 className="font-serif text-3xl text-bordo">Quartos</h1>

      <form onSubmit={save} className="mt-6 grid gap-4 rounded-lg border border-dourado/25 bg-white p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 font-serif text-xl text-bordo">{editing ? "Editar quarto" : "Novo quarto"}</h2>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-bordo">Nome</span>
          <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm" /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-bordo">Preço base (R$/noite)</span>
          <input required type="number" min={0} value={form.precoBase} onChange={(e) => setForm({ ...form, precoBase: Number(e.target.value) })} className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm" /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-bordo">Capacidade</span>
          <input required type="number" min={1} value={form.capacidade} onChange={(e) => setForm({ ...form, capacidade: Number(e.target.value) })} className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm" /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-bordo">Tamanho (m²)</span>
          <input required type="number" min={1} value={form.tamanhoM2} onChange={(e) => setForm({ ...form, tamanhoM2: Number(e.target.value) })} className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm" /></label>
        <label className="block md:col-span-2"><span className="mb-1 block text-xs font-semibold uppercase text-bordo">Descrição</span>
          <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm" /></label>
        <label className="block md:col-span-2"><span className="mb-1 block text-xs font-semibold uppercase text-bordo">Amenidades (separadas por vírgula)</span>
          <input value={form.amenidades.join(", ")} onChange={(e) => setForm({ ...form, amenidades: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm" /></label>
        <label className="block md:col-span-2"><span className="mb-1 block text-xs font-semibold uppercase text-bordo">Fotos (uma URL por linha)</span>
          <textarea value={form.fotos.join("\n")} onChange={(e) => setForm({ ...form, fotos: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm" /></label>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="rounded-sm bg-bordo px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-creme hover:bg-bordo-light">Salvar</button>
          {editing && <button type="button" onClick={reset} className="rounded-sm border border-carvao/30 px-6 py-2.5 text-xs uppercase tracking-wider2 text-carvao/70">Cancelar</button>}
        </div>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((r) => (
          <div key={r.id} className="overflow-hidden rounded-lg border border-dourado/20 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {r.fotos[0] && <img src={r.fotos[0]} alt={r.nome} className="aspect-[4/3] w-full object-cover" />}
            <div className="p-4">
              <h3 className="font-serif text-lg text-bordo">{r.nome}</h3>
              <p className="text-sm text-carvao/60">{brl(r.precoBase)}/noite · até {r.capacidade} · {r.tamanhoM2}m²</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => edit(r)} className="rounded-sm border border-dourado px-3 py-1.5 text-xs text-dourado-dark hover:bg-dourado hover:text-carvao">Editar</button>
                <button onClick={() => remove(r.id)} className="rounded-sm border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build + verificação manual**

Run: `npm run build` (PASS). Em dev: criar, editar e excluir um quarto; verificar reflexo no fluxo do hóspede.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/quartos/page.tsx
git commit -m "feat(admin): CRUD de tipos de quarto"
```

---

### Task 14: Admin — Disponibilidade & Tarifas (calendário)

**Files:**
- Create: `src/components/booking/MonthCalendar.tsx`
- Create: `src/app/admin/disponibilidade/page.tsx`

**Interfaces:**
- Consumes: `api.getRoomTypes`, `api.listOverrides`, `api.setDayOverride`, `dates.ts` (`todayISO`, `addDays`, `parseISO`, `toISO`), `brl`.
- Produces:
  - `MonthCalendar({ year, month, overrides, onPickDay })` — grade do mês; dias com override `blocked` em vermelho, com `price` mostram o valor.
  - Página: seletor de quarto + navegação de mês; clicar num dia abre mini-form (bloquear on/off, preço) e chama `setDayOverride`.

- [ ] **Step 1: `MonthCalendar.tsx`**

```tsx
"use client";

import type { DayOverride } from "@/lib/booking/types";

const WEEK = ["D", "S", "T", "Q", "Q", "S", "S"];

export function MonthCalendar({
  year, month, overrides, onPickDay,
}: {
  year: number; month: number; // month 0-11
  overrides: DayOverride[];
  onPickDay: (iso: string) => void;
}) {
  const first = new Date(Date.UTC(year, month, 1));
  const startDow = first.getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  const ovOf = (iso: string) => overrides.find((o) => o.date === iso);

  return (
    <div>
      <div className="grid grid-cols-7 text-center text-xs text-carvao/50">
        {WEEK.map((w, i) => <div key={i} className="py-2">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((iso, i) =>
          iso === null ? <div key={i} /> : (
            <button key={iso} onClick={() => onPickDay(iso)}
              className={`flex h-16 flex-col items-start rounded-sm border p-1.5 text-left text-xs transition-colors ${
                ovOf(iso)?.blocked ? "border-red-300 bg-red-50 text-red-700" : "border-carvao/15 hover:border-dourado"
              }`}>
              <span className="font-medium">{Number(iso.slice(-2))}</span>
              {ovOf(iso)?.blocked && <span className="mt-auto">Bloqueado</span>}
              {typeof ovOf(iso)?.price === "number" && <span className="mt-auto text-dourado-dark">R$ {ovOf(iso)!.price}</span>}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `admin/disponibilidade/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { getRoomTypes, listOverrides, setDayOverride } from "@/lib/booking/api";
import type { DayOverride, RoomType } from "@/lib/booking/types";
import { MonthCalendar } from "@/components/booking/MonthCalendar";

export default function AdminDisponibilidade() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [roomId, setRoomId] = useState("");
  const [overrides, setOverrides] = useState<DayOverride[]>([]);
  const now = new Date();
  const [ym, setYm] = useState({ year: now.getUTCFullYear(), month: now.getUTCMonth() });
  const [sel, setSel] = useState<{ date: string; blocked: boolean; price: string } | null>(null);

  useEffect(() => { getRoomTypes().then((r) => { setRooms(r); if (r[0]) setRoomId(r[0].id); }); }, []);
  const loadOv = (id: string) => listOverrides(id).then(setOverrides);
  useEffect(() => { if (roomId) loadOv(roomId); }, [roomId]);

  const pick = (date: string) => {
    const ov = overrides.find((o) => o.date === date);
    setSel({ date, blocked: !!ov?.blocked, price: ov?.price != null ? String(ov.price) : "" });
  };

  const salvar = async () => {
    if (!sel) return;
    await setDayOverride({ roomTypeId: roomId, date: sel.date, blocked: sel.blocked || undefined, price: sel.price ? Number(sel.price) : undefined });
    setSel(null); loadOv(roomId);
  };

  const nav = (delta: number) => setYm((s) => {
    const m = s.month + delta;
    return { year: s.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-bordo">Disponibilidade & Tarifas</h1>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="rounded-sm border border-carvao/20 px-3 py-2 text-sm">
          {rooms.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => nav(-1)} className="rounded-sm border border-carvao/20 px-3 py-1.5 text-sm">‹</button>
          <span className="min-w-[140px] text-center text-sm font-medium text-bordo">{new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(ym.year, ym.month, 1)))}</span>
          <button onClick={() => nav(1)} className="rounded-sm border border-carvao/20 px-3 py-1.5 text-sm">›</button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="rounded-lg border border-dourado/20 bg-white p-4">
          <MonthCalendar year={ym.year} month={ym.month} overrides={overrides} onPickDay={pick} />
        </div>
        <aside className="h-fit rounded-lg border border-dourado/25 bg-white p-6">
          {sel ? (
            <>
              <h3 className="font-serif text-lg text-bordo">{sel.date}</h3>
              <label className="mt-4 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={sel.blocked} onChange={(e) => setSel({ ...sel, blocked: e.target.checked })} /> Bloquear este dia
              </label>
              <label className="mt-4 block text-sm">
                <span className="mb-1 block text-xs font-semibold uppercase text-bordo">Preço especial (R$)</span>
                <input type="number" min={0} value={sel.price} onChange={(e) => setSel({ ...sel, price: e.target.value })} className="w-full rounded-sm border border-carvao/20 px-3 py-2" />
              </label>
              <button onClick={salvar} className="mt-5 w-full rounded-sm bg-bordo px-4 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-creme hover:bg-bordo-light">Salvar dia</button>
            </>
          ) : (
            <p className="text-sm text-carvao/60">Clique num dia do calendário para bloquear ou definir um preço especial.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build + verificação manual**

Run: `npm run build` (PASS). Em dev: bloquear um dia e ver o quarto sumir da busca naquele período; definir preço e ver o total mudar no fluxo do hóspede.

- [ ] **Step 4: Commit**

```bash
git add src/components/booking/MonthCalendar.tsx src/app/admin/disponibilidade/page.tsx
git commit -m "feat(admin): calendário de disponibilidade e tarifas"
```

---

### Task 15: Integração final e verificação

**Files:**
- Modify: `README.md` (seção do motor de reservas)
- Modify: `src/app/hotel-stefano/reservas` (garantir link do menu já aponta para o wizard — sem mudança de rota necessária)

- [ ] **Step 1: Rodar toda a suíte de testes**

Run: `npm test`
Expected: PASS (dates, store, format).

- [ ] **Step 2: Build de produção**

Run: `npm run build`
Expected: PASS; rotas novas listadas (`/hotel-stefano/reservas`, `/hotel-stefano/reservas/hospede`, `/hotel-stefano/reservas/confirmacao`, `/admin`, `/admin/login`, `/admin/reservas`, `/admin/quartos`, `/admin/disponibilidade`).

- [ ] **Step 3: Documentar no README**

Adicione uma seção "Motor de reservas" explicando: rota do hóspede, painel `/admin` (login demo `admin`/`stefano`), persistência em localStorage e que a camada `src/lib/booking/api.ts` é o ponto de troca por Supabase.

- [ ] **Step 4: Commit + push**

```bash
git add README.md
git commit -m "docs: seção do motor de reservas no README"
git push origin main
```

- [ ] **Step 5: Confirmar deploy na Vercel**

Verificar via painel/inspector que o deploy do commit final ficou `Ready`.

---

## Self-Review

**Spec coverage:**
- Camada de dados desacoplada → Tasks 2,5,6 (types/store/api). ✓
- Persistência localStorage → Task 6. ✓
- Fluxo do hóspede (4 passos) → Tasks 8,9,10. ✓
- Painel admin (login, reservas, quartos, disponibilidade/tarifas) → Tasks 11,12,13,14. ✓
- Visual do design system → todas as tasks de UI usam tokens `bordo/dourado/creme/carvao`. ✓
- Fallback Cloudbeds/WhatsApp → Task 9 (passo 1). ✓
- Fora de escopo (pagamento, e-mail, auth real, Supabase) → não implementado, camada pronta. ✓

**Placeholder scan:** nenhum TBD/TODO; todo passo de código traz o código.

**Type consistency:** `RoomType`, `Reservation`, `DayOverride`, `SearchParams`, `AvailabilityResult` usados consistentemente entre `store.ts`, `api.ts` e UI; nomes de funções da API idênticos entre Task 6 e as tasks de UI (`searchAvailability`, `createReservation`, `getReservation`, `listReservations`, `updateReservationStatus`, `upsertRoomType`, `deleteRoomType`, `listOverrides`, `setDayOverride`).

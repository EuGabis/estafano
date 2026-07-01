// E2E do caminho público com a chave ANON (como no browser).
// Valida RPCs + RLS. Só local. Uso: node scripts/e2e-anon.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(join(root, ".env.local"), "utf8");
const get = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1];

const supa = createClient(
  get("NEXT_PUBLIC_SUPABASE_URL"),
  get("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
);

let fail = 0;
const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fail++; };

// 1) disponibilidade via RPC (anon)
const { data: avail, error: e1 } = await supa.rpc("search_availability", {
  p_checkin: "2026-09-10", p_checkout: "2026-09-12", p_guests: 2,
});
ok(!e1 && Array.isArray(avail) && avail.length > 0, `search_availability retornou ${avail?.length} quartos`);

// 2) criar reserva via RPC (anon)
const rt = avail[0];
const { data: created, error: e2 } = await supa.rpc("create_reservation", {
  p_room_type_id: rt.room_type_id, p_checkin: "2026-09-10", p_checkout: "2026-09-12",
  p_guests: 2, p_nome: "E2E Teste", p_email: "e2e@teste.com",
  p_telefone: "11900000000", p_observacoes: "reserva de teste",
});
const row = Array.isArray(created) ? created[0] : created;
ok(!e2 && row?.codigo?.startsWith("STF-"), `create_reservation gerou ${row?.codigo} (total ${row?.total})`);

// 3) anon NÃO pode ler reservations direto (RLS)
const { data: leak } = await supa.from("reservations").select("*");
ok(!leak || leak.length === 0, `anon bloqueado de SELECT direto em reservations (viu ${leak?.length ?? 0} linhas)`);

// 4) anon pode ler room_types (catálogo público)
const { data: rts, error: e4 } = await supa.from("room_types").select("slug");
ok(!e4 && rts.length === 3, `anon lê room_types (${rts?.length} quartos)`);

console.log(fail === 0 ? "\nTODOS OS CHECKS PASSARAM" : `\n${fail} CHECK(S) FALHARAM`);
process.exit(fail === 0 ? 0 : 1);

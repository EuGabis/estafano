// Cria uma conta de staff no Supabase Auth (usa service_role do .env.local).
// Uso: node scripts/create-staff.mjs email@dominio.com SenhaForte
// Só local. Nunca deployado. Não contém segredos.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(join(root, ".env.local"), "utf8");
const get = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1];

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Uso: node scripts/create-staff.mjs email senha");
  process.exit(1);
}

const admin = createClient(
  get("NEXT_PUBLIC_SUPABASE_URL"),
  get("SUPABASE_SERVICE_ROLE"),
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});
if (error) {
  console.error("ERRO:", error.message);
  process.exit(1);
}
console.log("Staff criado:", data.user.email);

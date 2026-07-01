// Aplica os arquivos SQL no Supabase usando SUPABASE_DB_URL do .env.local.
// Uso: node scripts/apply-sql.mjs [arquivo1.sql arquivo2.sql ...]
// Sem argumentos, aplica migrations na ordem + seed.
// Este script roda SÓ localmente. Nunca é deployado. Não contém segredos.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// carrega .env.local explicitamente (dotenv/config lê .env por padrão)
try {
  const env = readFileSync(join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  /* .env.local ausente — segue com env do shell */
}

// Preferir o pooler IPv4 (conexão direta é IPv6-only em muitas redes).
const usePooler = !!process.env.SUPABASE_POOLER_HOST;
if (!usePooler && !process.env.SUPABASE_DB_URL) {
  console.error("Falta SUPABASE_POOLER_HOST ou SUPABASE_DB_URL no .env.local");
  process.exit(1);
}
const clientConfig = usePooler
  ? {
      host: process.env.SUPABASE_POOLER_HOST,
      port: Number(process.env.SUPABASE_POOLER_PORT || 5432),
      user: process.env.SUPABASE_POOLER_USER,
      password: process.env.SUPABASE_DB_PASSWORD,
      database: "postgres",
      ssl: { rejectUnauthorized: false },
    }
  : {
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false },
    };

const files =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : [
        "supabase/migrations/001_schema.sql",
        "supabase/migrations/002_rpc.sql",
        "supabase/migrations/003_policies.sql",
        "supabase/seed.sql",
      ];

const client = new pg.Client(clientConfig);

try {
  await client.connect();
  for (const f of files) {
    const sql = readFileSync(join(root, f), "utf8");
    process.stdout.write(`> ${f} ... `);
    await client.query(sql);
    console.log("ok");
  }
  console.log("Concluído.");
} catch (err) {
  console.error("\nERRO:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}

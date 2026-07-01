// Runner de query pontual via pooler. Uso: node scripts/query.mjs "SELECT ..."
// Lê credenciais do .env.local. Só local, nunca deployado.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(join(root, ".env.local"), "utf8");
const get = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1];

const client = new pg.Client({
  host: get("SUPABASE_POOLER_HOST"),
  port: Number(get("SUPABASE_POOLER_PORT") || 5432),
  user: get("SUPABASE_POOLER_USER"),
  password: get("SUPABASE_DB_PASSWORD"),
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

const sql = process.argv[2];
if (!sql) { console.error('Uso: node scripts/query.mjs "SQL"'); process.exit(1); }

try {
  await client.connect();
  const r = await client.query(sql);
  console.log(JSON.stringify(r.rows, null, 2));
} catch (e) {
  console.error("ERRO:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}

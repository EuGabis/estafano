# Banco Supabase — como aplicar

As credenciais ficam em `.env.local` (não commitado). **Nunca cole segredos aqui.**

## Aplicar migrações + seed

Com Node (usa `SUPABASE_DB_URL` do `.env.local`):

```bash
node scripts/apply-sql.mjs
```

Isso roda, na ordem: `migrations/001_schema.sql`, `002_rpc.sql`, `003_policies.sql`, `seed.sql`.

Para rodar arquivos específicos:

```bash
node scripts/apply-sql.mjs supabase/migrations/002_rpc.sql
```

Alternativa sem Node: colar cada arquivo no **SQL Editor** do painel Supabase, na ordem.

## Realtime

Habilitar Realtime na tabela `reservations` (feito automaticamente por
`node scripts/enable-realtime.mjs`, ou manualmente):

```sql
alter publication supabase_realtime add table reservations;
```

Ou no painel: **Database → Replication → supabase_realtime → adicionar `reservations`**.

## Contas de staff

Criar em **Authentication → Users → Add user** (sem auto-cadastro público).
As mesmas contas servem ao admin do site e ao CRM.

-- room_types: catálogo público (leitura), gestão só logado
drop policy if exists room_types_select_all on room_types;
create policy room_types_select_all on room_types
  for select using (true);
drop policy if exists room_types_write_auth on room_types;
create policy room_types_write_auth on room_types
  for all to authenticated using (true) with check (true);

-- reservations: NENHUM acesso direto ao anon (usa RPC). Logado gerencia.
drop policy if exists reservations_select_auth on reservations;
create policy reservations_select_auth on reservations
  for select to authenticated using (true);
drop policy if exists reservations_update_auth on reservations;
create policy reservations_update_auth on reservations
  for update to authenticated using (true) with check (true);
drop policy if exists reservations_insert_auth on reservations;
create policy reservations_insert_auth on reservations
  for insert to authenticated with check (true);

-- day_overrides: só logado (público enxerga via search_availability)
drop policy if exists overrides_all_auth on day_overrides;
create policy overrides_all_auth on day_overrides
  for all to authenticated using (true) with check (true);

-- contact_notes: só logado
drop policy if exists notes_all_auth on contact_notes;
create policy notes_all_auth on contact_notes
  for all to authenticated using (true) with check (true);

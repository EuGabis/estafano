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

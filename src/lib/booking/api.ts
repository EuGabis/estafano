import type {
  AvailabilityResult,
  DayOverride,
  Guest,
  Reservation,
  ReservationStatus,
  RoomType,
  SearchParams,
} from "./types";
import { supabase } from "../supabase/client";
import { rowToRoomType, rowToReservation, rowToOverride } from "./mappers";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getRoomTypes(): Promise<RoomType[]> {
  const { data, error } = await supabase
    .from("room_types")
    .select("*")
    .order("preco_base");
  if (error) throw error;
  return (data ?? []).map(rowToRoomType);
}

export async function getRoomType(id: string): Promise<RoomType | null> {
  const { data, error } = await supabase
    .from("room_types")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToRoomType(data) : null;
}

export async function searchAvailability(
  params: SearchParams,
): Promise<AvailabilityResult[]> {
  const { data, error } = await supabase.rpc("search_availability", {
    p_checkin: params.checkin,
    p_checkout: params.checkout,
    p_guests: params.guests,
  });
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    roomType: {
      id: row.room_type_id,
      nome: row.nome,
      slug: row.slug,
      descricao: row.descricao,
      capacidade: row.capacidade,
      tamanhoM2: row.tamanho_m2,
      amenidades: row.amenidades ?? [],
      fotos: row.fotos ?? [],
      precoBase: Number(row.preco_noite),
    },
    noites: row.noites,
    precoNoite: Number(row.preco_noite),
    total: Number(row.total),
  }));
}

export async function createReservation(input: {
  roomTypeId: string;
  params: SearchParams;
  guest: Guest;
}): Promise<Reservation> {
  const { data, error } = await supabase.rpc("create_reservation", {
    p_room_type_id: input.roomTypeId,
    p_checkin: input.params.checkin,
    p_checkout: input.params.checkout,
    p_guests: input.params.guests,
    p_nome: input.guest.nome,
    p_email: input.guest.email,
    p_telefone: input.guest.telefone,
    p_observacoes: input.guest.observacoes ?? "",
  });
  if (error) throw error;
  return rowToReservation(Array.isArray(data) ? data[0] : data);
}

export async function getReservation(
  codigo: string,
): Promise<Reservation | null> {
  const { data, error } = await supabase.rpc("get_reservation_by_codigo", {
    p_codigo: codigo,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row ? rowToReservation(row) : null;
}

export async function listReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToReservation);
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<void> {
  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function upsertRoomType(rt: RoomType): Promise<void> {
  const row: Record<string, unknown> = {
    nome: rt.nome,
    slug: rt.slug,
    descricao: rt.descricao,
    capacidade: rt.capacidade,
    tamanho_m2: rt.tamanhoM2,
    amenidades: rt.amenidades,
    fotos: rt.fotos,
    preco_base: rt.precoBase,
  };
  // Só envia id quando é um UUID válido (edição). Novo quarto: banco gera o id.
  if (rt.id && /^[0-9a-f-]{36}$/i.test(rt.id)) row.id = rt.id;
  const { error } = await supabase
    .from("room_types")
    .upsert(row, { onConflict: rt.id ? "id" : "slug" });
  if (error) throw error;
}

export async function deleteRoomType(id: string): Promise<void> {
  const { error } = await supabase.from("room_types").delete().eq("id", id);
  if (error) throw error;
}

export async function listOverrides(
  roomTypeId: string,
): Promise<DayOverride[]> {
  const { data, error } = await supabase
    .from("day_overrides")
    .select("*")
    .eq("room_type_id", roomTypeId);
  if (error) throw error;
  return (data ?? []).map(rowToOverride);
}

export async function setDayOverride(ov: DayOverride): Promise<void> {
  const keep = ov.blocked || typeof ov.price === "number";
  if (!keep) {
    const { error } = await supabase
      .from("day_overrides")
      .delete()
      .eq("room_type_id", ov.roomTypeId)
      .eq("date", ov.date);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("day_overrides").upsert({
    room_type_id: ov.roomTypeId,
    date: ov.date,
    blocked: ov.blocked ?? false,
    price: ov.price ?? null,
  });
  if (error) throw error;
}

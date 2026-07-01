import type { RoomType, Reservation, DayOverride } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToRoomType(row: any): RoomType {
  return {
    id: row.id,
    nome: row.nome,
    slug: row.slug,
    descricao: row.descricao,
    capacidade: row.capacidade,
    tamanhoM2: row.tamanho_m2,
    amenidades: row.amenidades ?? [],
    fotos: row.fotos ?? [],
    precoBase: Number(row.preco_base),
  };
}

export function rowToReservation(row: any): Reservation {
  return {
    id: row.id,
    codigo: row.codigo,
    roomTypeId: row.room_type_id,
    checkin: row.checkin,
    checkout: row.checkout,
    noites: row.noites,
    hospedes: row.hospedes,
    total: Number(row.total),
    guest: {
      nome: row.guest_nome,
      email: row.guest_email,
      telefone: row.guest_telefone,
      observacoes: row.guest_observacoes ?? undefined,
    },
    status: row.status,
    criadoEm: row.criado_em,
  };
}

export function rowToOverride(row: any): DayOverride {
  return {
    roomTypeId: row.room_type_id,
    date: row.date,
    blocked: row.blocked ?? undefined,
    price: row.price != null ? Number(row.price) : undefined,
  };
}

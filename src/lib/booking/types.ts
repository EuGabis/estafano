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

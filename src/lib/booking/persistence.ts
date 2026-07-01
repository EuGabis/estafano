import type { DayOverride, Reservation, RoomType } from "./types";
import { SEED_ROOM_TYPES } from "./seed";

const KEY = "stefano.booking.v1";

export interface BookingState {
  roomTypes: RoomType[];
  reservations: Reservation[];
  overrides: DayOverride[];
  seq: number;
}

function defaultState(): BookingState {
  return { roomTypes: SEED_ROOM_TYPES, reservations: [], overrides: [], seq: 0 };
}

export function readState(): BookingState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<BookingState>;
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function writeState(state: BookingState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

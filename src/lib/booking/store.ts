import type {
  AvailabilityResult,
  DayOverride,
  Reservation,
  RoomType,
  SearchParams,
} from "./types";
import { eachDate, nightsBetween } from "./dates";

export function genCodigo(seq: number): string {
  return `STF-${String(seq).padStart(4, "0")}`;
}

export function isRoomAvailable(
  roomTypeId: string,
  checkin: string,
  checkout: string,
  reservations: Reservation[],
  overrides: DayOverride[],
): boolean {
  const dias = new Set(eachDate(checkin, checkout));
  const blocked = overrides.some(
    (o) => o.roomTypeId === roomTypeId && o.blocked && dias.has(o.date),
  );
  if (blocked) return false;
  return !reservations.some(
    (r) =>
      r.roomTypeId === roomTypeId &&
      r.status !== "cancelada" &&
      eachDate(r.checkin, r.checkout).some((d) => dias.has(d)),
  );
}

export function priceFor(
  roomType: RoomType,
  checkin: string,
  checkout: string,
  overrides: DayOverride[],
): { precoNoite: number; total: number } {
  const dias = eachDate(checkin, checkout);
  const priceOf = (date: string) => {
    const ov = overrides.find(
      (o) =>
        o.roomTypeId === roomType.id &&
        o.date === date &&
        typeof o.price === "number",
    );
    return ov?.price ?? roomType.precoBase;
  };
  const total = dias.reduce((sum, d) => sum + priceOf(d), 0);
  const precoNoite = dias.length ? priceOf(dias[0]) : roomType.precoBase;
  return { precoNoite, total };
}

export function computeAvailability(
  params: SearchParams,
  roomTypes: RoomType[],
  reservations: Reservation[],
  overrides: DayOverride[],
): AvailabilityResult[] {
  const noites = nightsBetween(params.checkin, params.checkout);
  return roomTypes
    .filter((rt) => rt.capacidade >= params.guests)
    .filter((rt) =>
      isRoomAvailable(rt.id, params.checkin, params.checkout, reservations, overrides),
    )
    .map((rt) => {
      const { precoNoite, total } = priceFor(
        rt,
        params.checkin,
        params.checkout,
        overrides,
      );
      return { roomType: rt, noites, precoNoite, total };
    });
}

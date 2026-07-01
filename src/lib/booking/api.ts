import type {
  AvailabilityResult,
  DayOverride,
  Guest,
  Reservation,
  ReservationStatus,
  RoomType,
  SearchParams,
} from "./types";
import { readState, writeState } from "./persistence";
import { computeAvailability, genCodigo, priceFor } from "./store";
import { nightsBetween } from "./dates";

const delay = () => new Promise((r) => setTimeout(r, 120)); // simula rede

export async function getRoomTypes(): Promise<RoomType[]> {
  await delay();
  return readState().roomTypes;
}

export async function getRoomType(id: string): Promise<RoomType | null> {
  await delay();
  return readState().roomTypes.find((r) => r.id === id) ?? null;
}

export async function searchAvailability(
  params: SearchParams,
): Promise<AvailabilityResult[]> {
  await delay();
  const s = readState();
  return computeAvailability(params, s.roomTypes, s.reservations, s.overrides);
}

export async function createReservation(input: {
  roomTypeId: string;
  params: SearchParams;
  guest: Guest;
}): Promise<Reservation> {
  await delay();
  const s = readState();
  const rt = s.roomTypes.find((r) => r.id === input.roomTypeId);
  if (!rt) throw new Error("Tipo de quarto inexistente");
  const { total } = priceFor(
    rt,
    input.params.checkin,
    input.params.checkout,
    s.overrides,
  );
  const seq = s.seq + 1;
  const reservation: Reservation = {
    id: `${Date.now()}-${seq}`,
    codigo: genCodigo(seq),
    roomTypeId: rt.id,
    checkin: input.params.checkin,
    checkout: input.params.checkout,
    noites: nightsBetween(input.params.checkin, input.params.checkout),
    hospedes: input.params.guests,
    total,
    guest: input.guest,
    status: "pendente",
    criadoEm: new Date().toISOString(),
  };
  writeState({ ...s, reservations: [...s.reservations, reservation], seq });
  return reservation;
}

export async function getReservation(codigo: string): Promise<Reservation | null> {
  await delay();
  return readState().reservations.find((r) => r.codigo === codigo) ?? null;
}

export async function listReservations(): Promise<Reservation[]> {
  await delay();
  return [...readState().reservations].sort((a, b) =>
    b.criadoEm.localeCompare(a.criadoEm),
  );
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<void> {
  await delay();
  const s = readState();
  writeState({
    ...s,
    reservations: s.reservations.map((r) =>
      r.id === id ? { ...r, status } : r,
    ),
  });
}

export async function upsertRoomType(rt: RoomType): Promise<void> {
  await delay();
  const s = readState();
  const exists = s.roomTypes.some((r) => r.id === rt.id);
  writeState({
    ...s,
    roomTypes: exists
      ? s.roomTypes.map((r) => (r.id === rt.id ? rt : r))
      : [...s.roomTypes, rt],
  });
}

export async function deleteRoomType(id: string): Promise<void> {
  await delay();
  const s = readState();
  writeState({ ...s, roomTypes: s.roomTypes.filter((r) => r.id !== id) });
}

export async function listOverrides(roomTypeId: string): Promise<DayOverride[]> {
  await delay();
  return readState().overrides.filter((o) => o.roomTypeId === roomTypeId);
}

export async function setDayOverride(ov: DayOverride): Promise<void> {
  await delay();
  const s = readState();
  const rest = s.overrides.filter(
    (o) => !(o.roomTypeId === ov.roomTypeId && o.date === ov.date),
  );
  const keep = ov.blocked || typeof ov.price === "number";
  writeState({ ...s, overrides: keep ? [...rest, ov] : rest });
}

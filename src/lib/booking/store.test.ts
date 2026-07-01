import { describe, it, expect } from "vitest";
import { genCodigo, isRoomAvailable, priceFor, computeAvailability } from "./store";
import { SEED_ROOM_TYPES } from "./seed";
import type { Reservation } from "./types";

const base: Omit<Reservation, "roomTypeId" | "checkin" | "checkout" | "status"> = {
  id: "r1",
  codigo: "STF-0001",
  noites: 1,
  hospedes: 2,
  total: 420,
  guest: { nome: "A", email: "a@a.com", telefone: "1" },
  criadoEm: "2026-07-01T00:00:00Z",
};

describe("store", () => {
  it("gera código com zero-pad", () => {
    expect(genCodigo(1)).toBe("STF-0001");
    expect(genCodigo(42)).toBe("STF-0042");
  });

  it("quarto indisponível quando datas colidem com reserva ativa", () => {
    const res: Reservation[] = [
      { ...base, roomTypeId: "deluxe", checkin: "2026-07-10", checkout: "2026-07-12", status: "confirmada" },
    ];
    expect(isRoomAvailable("deluxe", "2026-07-11", "2026-07-13", res, [])).toBe(false);
    expect(isRoomAvailable("deluxe", "2026-07-12", "2026-07-14", res, [])).toBe(true);
  });

  it("reserva cancelada não bloqueia", () => {
    const res: Reservation[] = [
      { ...base, roomTypeId: "deluxe", checkin: "2026-07-10", checkout: "2026-07-12", status: "cancelada" },
    ];
    expect(isRoomAvailable("deluxe", "2026-07-10", "2026-07-12", res, [])).toBe(true);
  });

  it("override blocked torna indisponível", () => {
    expect(
      isRoomAvailable("deluxe", "2026-07-10", "2026-07-11", [], [
        { roomTypeId: "deluxe", date: "2026-07-10", blocked: true },
      ]),
    ).toBe(false);
  });

  it("preço usa precoBase e soma por noite", () => {
    const rt = SEED_ROOM_TYPES[0]; // 420
    expect(priceFor(rt, "2026-07-10", "2026-07-13", [])).toEqual({ precoNoite: 420, total: 1260 });
  });

  it("override de preço afeta o total", () => {
    const rt = SEED_ROOM_TYPES[0];
    const ov = [{ roomTypeId: "deluxe", date: "2026-07-10", price: 500 }];
    expect(priceFor(rt, "2026-07-10", "2026-07-12", ov)).toEqual({ precoNoite: 500, total: 920 });
  });

  it("computeAvailability filtra por capacidade e disponibilidade", () => {
    const out = computeAvailability(
      { checkin: "2026-07-10", checkout: "2026-07-11", guests: 4 },
      SEED_ROOM_TYPES,
      [],
      [],
    );
    expect(out.map((r) => r.roomType.id)).toEqual(["deluxe-familia"]);
  });
});

import { describe, it, expect } from "vitest";
import { rowToRoomType, rowToReservation, rowToOverride } from "./mappers";

describe("mappers", () => {
  it("mapeia room_type row -> RoomType", () => {
    const rt = rowToRoomType({
      id: "abc", nome: "Deluxe", slug: "deluxe", descricao: "x",
      capacidade: 2, tamanho_m2: 20, amenidades: ["Wi-Fi"], fotos: ["/a.png"],
      preco_base: "420.00",
    });
    expect(rt).toEqual({
      id: "abc", nome: "Deluxe", slug: "deluxe", descricao: "x",
      capacidade: 2, tamanhoM2: 20, amenidades: ["Wi-Fi"], fotos: ["/a.png"],
      precoBase: 420,
    });
  });

  it("mapeia reservation row -> Reservation", () => {
    const r = rowToReservation({
      id: "1", codigo: "STF-0001", room_type_id: "abc",
      checkin: "2026-07-10", checkout: "2026-07-12", noites: 2, hospedes: 2,
      total: "840.00", guest_nome: "Ana", guest_email: "a@x.com",
      guest_telefone: "11999", guest_observacoes: null, status: "pendente",
      criado_em: "2026-07-01T12:00:00Z",
    });
    expect(r.codigo).toBe("STF-0001");
    expect(r.guest).toEqual({ nome: "Ana", email: "a@x.com", telefone: "11999", observacoes: undefined });
    expect(r.total).toBe(840);
    expect(r.roomTypeId).toBe("abc");
    expect(r.status).toBe("pendente");
  });

  it("mapeia override row -> DayOverride", () => {
    expect(rowToOverride({ room_type_id: "abc", date: "2026-08-01", blocked: true, price: null }))
      .toEqual({ roomTypeId: "abc", date: "2026-08-01", blocked: true, price: undefined });
    expect(rowToOverride({ room_type_id: "abc", date: "2026-08-02", blocked: false, price: "500.00" }))
      .toEqual({ roomTypeId: "abc", date: "2026-08-02", blocked: false, price: 500 });
  });
});

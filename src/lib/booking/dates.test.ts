import { describe, it, expect } from "vitest";
import {
  nightsBetween,
  eachDate,
  isValidRange,
  addDays,
  formatBR,
} from "./dates";

describe("dates", () => {
  it("conta noites entre duas datas", () => {
    expect(nightsBetween("2026-07-01", "2026-07-04")).toBe(3);
  });
  it("retorna 0 para datas iguais", () => {
    expect(nightsBetween("2026-07-01", "2026-07-01")).toBe(0);
  });
  it("eachDate inclui checkin e exclui checkout", () => {
    expect(eachDate("2026-07-01", "2026-07-03")).toEqual([
      "2026-07-01",
      "2026-07-02",
    ]);
  });
  it("valida intervalo (checkout deve ser depois)", () => {
    expect(isValidRange("2026-07-01", "2026-07-02")).toBe(true);
    expect(isValidRange("2026-07-02", "2026-07-01")).toBe(false);
    expect(isValidRange("2026-07-01", "2026-07-01")).toBe(false);
  });
  it("addDays soma dias corretamente atravessando o mês", () => {
    expect(addDays("2026-07-31", 1)).toBe("2026-08-01");
  });
  it("formata data em pt-BR", () => {
    expect(formatBR("2026-07-09")).toBe("09/07/2026");
  });
});

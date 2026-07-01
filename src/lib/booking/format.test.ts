import { describe, it, expect } from "vitest";
import { brl } from "./format";

describe("format", () => {
  it("formata BRL", () => {
    // normaliza espaços (Intl pode usar NBSP)
    expect(brl(420).replace(/\s/g, " ")).toBe("R$ 420,00");
    expect(brl(1260).replace(/\s/g, " ")).toBe("R$ 1.260,00");
  });
});

"use client";

import { useState } from "react";
import type { SearchParams } from "@/lib/booking/types";
import { isValidRange, todayISO, addDays } from "@/lib/booking/dates";

export function SearchForm({
  initial,
  onSearch,
}: {
  initial?: SearchParams;
  onSearch: (p: SearchParams) => void;
}) {
  const [checkin, setCheckin] = useState(initial?.checkin ?? "");
  const [checkout, setCheckout] = useState(initial?.checkout ?? "");
  const [guests, setGuests] = useState(initial?.guests ?? 2);
  const [erro, setErro] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidRange(checkin, checkout)) {
      setErro("Selecione uma data de partida posterior à chegada.");
      return;
    }
    setErro("");
    onSearch({ checkin, checkout, guests });
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-dourado/30 bg-white p-5 shadow-sm md:flex md:items-end md:gap-4"
    >
      <label className="mb-4 block flex-1 md:mb-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">
          Chegada
        </span>
        <input
          type="date"
          min={todayISO()}
          value={checkin}
          onChange={(e) => {
            setCheckin(e.target.value);
            if (checkout && e.target.value >= checkout)
              setCheckout(addDays(e.target.value, 1));
          }}
          className="w-full rounded-sm border border-carvao/20 px-3 py-2.5 text-sm outline-none focus:border-dourado"
        />
      </label>
      <label className="mb-4 block flex-1 md:mb-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">
          Partida
        </span>
        <input
          type="date"
          min={checkin ? addDays(checkin, 1) : todayISO()}
          value={checkout}
          onChange={(e) => setCheckout(e.target.value)}
          className="w-full rounded-sm border border-carvao/20 px-3 py-2.5 text-sm outline-none focus:border-dourado"
        />
      </label>
      <label className="mb-4 block md:mb-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">
          Hóspedes
        </span>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-sm border border-carvao/20 px-3 py-2.5 text-sm outline-none focus:border-dourado"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "hóspede" : "hóspedes"}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="w-full rounded-sm bg-bordo px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-creme transition-colors hover:bg-bordo-light md:w-auto"
      >
        Pesquisar
      </button>
      {erro && <p className="mt-3 w-full text-sm text-bordo md:mt-2">{erro}</p>}
    </form>
  );
}

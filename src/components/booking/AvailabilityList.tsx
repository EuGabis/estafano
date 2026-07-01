"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AvailabilityResult, SearchParams } from "@/lib/booking/types";
import { searchAvailability } from "@/lib/booking/api";
import { brl } from "@/lib/booking/format";

export function AvailabilityList({ params }: { params: SearchParams }) {
  const [results, setResults] = useState<AvailabilityResult[] | null>(null);

  useEffect(() => {
    let alive = true;
    setResults(null);
    searchAvailability(params).then((r) => {
      if (alive) setResults(r);
    });
    return () => {
      alive = false;
    };
  }, [params]);

  if (results === null)
    return (
      <p className="py-10 text-center text-carvao/60">Buscando disponibilidade…</p>
    );
  if (results.length === 0)
    return (
      <p className="py-10 text-center text-carvao/70">
        Nenhum quarto disponível para as datas e hóspedes selecionados.
      </p>
    );

  const qs = new URLSearchParams({
    checkin: params.checkin,
    checkout: params.checkout,
    guests: String(params.guests),
  });

  return (
    <div className="space-y-6">
      {results.map(({ roomType, noites, precoNoite, total }) => (
        <div
          key={roomType.id}
          className="grid overflow-hidden rounded-lg border border-dourado/25 bg-white shadow-sm md:grid-cols-[280px_1fr]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={roomType.fotos[0]}
            alt={roomType.nome}
            className="h-full min-h-[200px] w-full object-cover"
          />
          <div className="flex flex-col p-6">
            <h3 className="font-serif text-2xl text-bordo">{roomType.nome}</h3>
            <p className="mt-1 text-sm text-carvao/70">{roomType.descricao}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {roomType.amenidades.slice(0, 5).map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-dourado/40 px-3 py-1 text-xs text-carvao/70"
                >
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
              <div>
                <p className="text-sm text-carvao/60">
                  {brl(precoNoite)} / noite · {noites}{" "}
                  {noites === 1 ? "noite" : "noites"}
                </p>
                <p className="font-serif text-2xl text-bordo">{brl(total)}</p>
              </div>
              <Link
                href={`/hotel-stefano/reservas/hospede?${qs.toString()}&room=${roomType.id}`}
                className="rounded-sm bg-dourado px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-carvao transition-colors hover:bg-dourado-dark hover:text-creme"
              >
                Selecionar
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

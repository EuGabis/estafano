"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/Section";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { getReservation } from "@/lib/booking/api";
import type { Reservation } from "@/lib/booking/types";
import { brl } from "@/lib/booking/format";
import { formatBR } from "@/lib/booking/dates";

function ConfirmacaoInner() {
  const codigo = useSearchParams().get("codigo") ?? "";
  const [r, setR] = useState<Reservation | null | undefined>(undefined);

  useEffect(() => {
    getReservation(codigo).then(setR);
  }, [codigo]);

  if (r === undefined)
    return (
      <Section>
        <p className="text-center text-carvao/60">Carregando…</p>
      </Section>
    );
  if (r === null)
    return (
      <Section>
        <p className="text-center text-carvao/70">Reserva não encontrada.</p>
      </Section>
    );

  return (
    <Section>
      <BookingSteps current={4} />
      <div className="mx-auto max-w-lg rounded-lg border border-dourado/30 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-dourado text-2xl text-dourado">
          ✓
        </div>
        <h2 className="font-serif text-3xl text-bordo">Reserva confirmada!</h2>
        <p className="mt-2 text-sm text-carvao/70">
          Guarde o seu código de reserva:
        </p>
        <p className="my-4 font-serif text-2xl tracking-widest text-dourado-dark">
          {r.codigo}
        </p>
        <dl className="mt-4 space-y-1 text-left text-sm text-carvao/75">
          <div className="flex justify-between">
            <dt>Hóspede</dt>
            <dd>{r.guest.nome}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Chegada</dt>
            <dd>{formatBR(r.checkin)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Partida</dt>
            <dd>{formatBR(r.checkout)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Noites</dt>
            <dd>{r.noites}</dd>
          </div>
          <div className="flex justify-between border-t border-carvao/10 pt-2 font-medium text-bordo">
            <dt>Total</dt>
            <dd>{brl(r.total)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-carvao/55">
          Pagamento na chegada. Em breve entraremos em contato para confirmar os
          detalhes.
        </p>
        <Link
          href="/hotel-stefano"
          className="mt-6 inline-block rounded-sm border border-bordo px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-bordo hover:bg-bordo hover:text-creme"
        >
          Voltar ao hotel
        </Link>
      </div>
    </Section>
  );
}

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmacaoInner />
    </Suspense>
  );
}

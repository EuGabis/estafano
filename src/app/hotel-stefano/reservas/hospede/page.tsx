"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Section } from "@/components/Section";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { getRoomType, createReservation } from "@/lib/booking/api";
import type { RoomType } from "@/lib/booking/types";
import { nightsBetween, formatBR } from "@/lib/booking/dates";
import { priceFor } from "@/lib/booking/store";
import { brl } from "@/lib/booking/format";

function HospedeInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const checkin = sp.get("checkin") ?? "";
  const checkout = sp.get("checkout") ?? "";
  const guests = Number(sp.get("guests") ?? "2");
  const roomId = sp.get("room") ?? "";

  const [rt, setRt] = useState<RoomType | null>(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    observacoes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getRoomType(roomId).then(setRt);
  }, [roomId]);

  if (!rt)
    return (
      <Section>
        <p className="text-center text-carvao/60">Carregando…</p>
      </Section>
    );

  const noites = nightsBetween(checkin, checkout);
  const { total } = priceFor(rt, checkin, checkout, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const r = await createReservation({
      roomTypeId: rt.id,
      params: { checkin, checkout, guests },
      guest: form,
    });
    router.push(`/hotel-stefano/reservas/confirmacao?codigo=${r.codigo}`);
  };

  return (
    <Section>
      <BookingSteps current={3} />
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className="space-y-4">
          <h2 className="font-serif text-2xl text-bordo">Seus dados</h2>
          {(["nome", "email", "telefone"] as const).map((f) => (
            <label key={f} className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">
                {f === "email" ? "E-mail" : f[0].toUpperCase() + f.slice(1)}
              </span>
              <input
                required
                type={f === "email" ? "email" : "text"}
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="w-full rounded-sm border border-carvao/20 px-4 py-2.5 text-sm outline-none focus:border-dourado"
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">
              Observações
            </span>
            <textarea
              rows={3}
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              className="w-full rounded-sm border border-carvao/20 px-4 py-2.5 text-sm outline-none focus:border-dourado"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-bordo px-8 py-3 text-xs font-semibold uppercase tracking-wider2 text-creme transition-colors hover:bg-bordo-light disabled:opacity-60"
          >
            {saving ? "Confirmando…" : "Confirmar reserva"}
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-dourado/25 bg-white p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rt.fotos[0]}
            alt={rt.nome}
            className="mb-4 aspect-[4/3] w-full rounded-sm object-cover"
          />
          <h3 className="font-serif text-xl text-bordo">{rt.nome}</h3>
          <dl className="mt-3 space-y-1 text-sm text-carvao/75">
            <div className="flex justify-between">
              <dt>Chegada</dt>
              <dd>{formatBR(checkin)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Partida</dt>
              <dd>{formatBR(checkout)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Noites</dt>
              <dd>{noites}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Hóspedes</dt>
              <dd>{guests}</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-carvao/10 pt-4 font-serif text-xl text-bordo">
            <span>Total</span>
            <span>{brl(total)}</span>
          </div>
          <p className="mt-2 text-xs text-carvao/55">Pagamento na chegada.</p>
        </aside>
      </div>
    </Section>
  );
}

export default function HospedePage() {
  return (
    <Suspense fallback={null}>
      <HospedeInner />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { SearchForm } from "@/components/booking/SearchForm";
import { AvailabilityList } from "@/components/booking/AvailabilityList";
import type { SearchParams } from "@/lib/booking/types";
import { isValidRange } from "@/lib/booking/dates";

function ReservasInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const checkin = sp.get("checkin") ?? "";
  const checkout = sp.get("checkout") ?? "";
  const guests = Number(sp.get("guests") ?? "2");
  const hasSearch = isValidRange(checkin, checkout);
  const params: SearchParams = { checkin, checkout, guests };

  const onSearch = (p: SearchParams) => {
    const qs = new URLSearchParams({
      checkin: p.checkin,
      checkout: p.checkout,
      guests: String(p.guests),
    });
    router.push(`/hotel-stefano/reservas?${qs.toString()}`);
  };

  return (
    <>
      <Hero
        eyebrow="Reservas"
        title="Reserve sua estadia"
        subtitle="Disponibilidade em tempo real, direto com a Família Stefano."
        image="/images/hotel/home-5.jpg"
        height="short"
      />
      <Section>
        <BookingSteps current={hasSearch ? 2 : 1} />
        <div className="mx-auto max-w-4xl">
          <SearchForm initial={hasSearch ? params : undefined} onSearch={onSearch} />
          {hasSearch ? (
            <div className="mt-10">
              <AvailabilityList params={params} />
            </div>
          ) : (
            <p className="mt-6 text-center text-sm text-carvao/60">
              Prefere reservar por telefone?{" "}
              <a
                href="https://wa.me/551147141464"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bordo underline"
              >
                Fale no WhatsApp
              </a>
              .
            </p>
          )}
        </div>
      </Section>
    </>
  );
}

export default function ReservasPage() {
  return (
    <Suspense fallback={null}>
      <ReservasInner />
    </Suspense>
  );
}

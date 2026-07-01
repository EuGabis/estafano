import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { SplitBlock } from "@/components/SplitBlock";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Hotel e Hospedagem — Casa Stefano",
  description:
    "Realize seu evento e ofereça aos convidados a comodidade de se hospedar no mesmo local.",
};

export default function HotelHospedagem() {
  return (
    <>
      <Hero
        eyebrow="Casa Stefano"
        title="Hotel e hospedagem"
        subtitle="sua experiência completa"
        image="/images/portal/hotel.jpg"
      />

      <Section>
        <p className="mx-auto max-w-3xl text-center font-serif text-2xl leading-relaxed text-bordo md:text-3xl">
          Realizar um evento no interior de São Paulo, cercado pela natureza e
          com uma gastronomia impecável é maravilhoso – mas fazer tudo isso e
          ainda oferecer para seus convidados a comodidade de se hospedar no
          mesmo local, é incrível.
        </p>
      </Section>

      <Section tone="creme" className="pt-0">
        <SplitBlock
          image="/images/hotel/home-2.jpg"
          alt="Hotel Stefano"
          eyebrow="Hotel Stefano"
          title="Estrategicamente pensado para você"
        >
          <p>
            O Stefano Hotel foi estrategicamente pensado para atrair turistas de
            todo o Brasil que desejam visitar a estância turística de São Roque
            e especialmente para atender os clientes da Casa Stefano, bem como
            seus convidados.
          </p>
          <div className="pt-2">
            <Button href="/hotel-stefano/reservas" variant="outline">
              Verifique disponibilidade
            </Button>
          </div>
        </SplitBlock>
      </Section>

      <FamilyStrip exclude="casa" />
    </>
  );
}

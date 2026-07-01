import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Reservas — Hotel Stefano",
  description:
    "Faça sua reserva online ou via WhatsApp. Momentos inesquecíveis te esperam no Hotel Stefano.",
};

const CLOUDBEDS = "https://hotels.cloudbeds.com/reservas/XGF1P5";

export default function Reservas() {
  return (
    <>
      <Hero
        eyebrow="Reservas"
        title="Reservas"
        subtitle="faça online ou via WhatsApp"
        image="/images/hotel/home-5.jpg"
        height="short"
      />

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-carvao/85">
            Momentos inesquecíveis te esperam no Hotel Stefano. Clique no link
            abaixo e reserve sua estadia de forma prática e 100% online.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-carvao/85">
            Dentro do nosso complexo, além do Hotel, oferecemos para nossos
            clientes a comodidade do Stefano Restaurante – tradição desde 1960
            na cidade de São Roque, com a melhor culinária italiana local, feita
            por autênticos italianos.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href={CLOUDBEDS} external>
              Faça sua reserva
            </Button>
            <a
              href="https://wa.me/551147141464"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm border border-bordo px-6 py-3 text-xs font-semibold uppercase tracking-wider2 text-bordo transition-colors hover:bg-bordo hover:text-creme"
            >
              Reservar via WhatsApp
            </a>
          </div>
        </div>
      </Section>

      <Section tone="bordo">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-sm shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/casa/casamento-4.jpg"
              alt="Casa Stefano"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <span className="eyebrow text-dourado-light">
              E também a Casa Stefano,
            </span>
            <h2 className="mt-3 font-serif text-2xl text-creme md:text-3xl">
              celebrações inesquecíveis no mesmo complexo
            </h2>
            <div className="rule-gold ml-0" />
            <p className="mt-4 leading-relaxed text-creme/80">
              Nosso espaço que comporta até 130 pessoas para eventos sociais e
              corporativos, cercado pela natureza e com a gastronomia assinada
              pelos nossos chefs.
            </p>
            <div className="mt-6">
              <Button href="/casa-stefano" variant="outline">
                Conhecer a Casa Stefano
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <FamilyStrip exclude="hotel" />
    </>
  );
}

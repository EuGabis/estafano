import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { MapsCta } from "@/components/MapsCta";
import { FamilyStrip } from "@/components/FamilyStrip";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Localização — Hotel Stefano",
  description:
    "Localização privilegiada em São Roque, em meio à natureza e próximo das principais atrações da cidade.",
};

const distancias = [
  { local: "Roteiro do Vinho", km: "4 KM" },
  { local: "São Roque", km: "5 KM" },
  { local: "Catarina Outlet", km: "38,6 KM" },
  { local: "Sorocaba", km: "51,4 KM" },
  { local: "São Paulo", km: "56 KM" },
  { local: "Aeroporto de Congonhas", km: "59,4 KM" },
  { local: "Aeroporto de Guarulhos", km: "78,3 KM" },
];

export default function Localizacao() {
  return (
    <>
      <Hero
        eyebrow="Localização"
        title="Localização"
        subtitle="facilidade para chegar"
        image="/images/hotel/home-4.jpg"
        height="short"
      />

      <Section>
        <p className="mx-auto max-w-3xl text-center font-serif text-2xl leading-relaxed text-bordo md:text-3xl">
          Nosso hotel tem localização privilegiada em São Roque, em meio à
          natureza e muito próximo das principais atrações que a cidade oferece.
        </p>
      </Section>

      <Section tone="creme" className="pt-0">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="eyebrow text-dourado-dark">Contato</h3>
            <ul className="mt-4 space-y-2 text-sm text-carvao/80">
              <li>Telefone / WhatsApp: (11) 4714-1464</li>
              <li>
                E-mail:{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-bordo hover:underline"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
            <h3 className="eyebrow mt-8 text-dourado-dark">Endereço</h3>
            <p className="mt-4 text-sm leading-relaxed text-carvao/80">
              Av. Antônio Pannellini, 2635 - Taboão - São Roque/SP
              <br />
              Rod. Raposo Tavares (altura do KM 56 - sentido São Roque)
            </p>
          </div>

          <div>
            <h3 className="eyebrow text-dourado-dark">Distâncias</h3>
            <ul className="mt-4 divide-y divide-carvao/10">
              {distancias.map((d) => (
                <li
                  key={d.local}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="text-carvao/80">{d.local}</span>
                  <span className="font-medium text-bordo">{d.km}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-sm border border-dourado/25 shadow-sm">
          <iframe
            title="Mapa Stefano Hotel e Restaurante"
            src="https://www.google.com/maps?q=-23.551084020172627,-47.10083484649659&z=15&output=embed"
            className="h-[380px] w-full"
            loading="lazy"
          />
        </div>
      </Section>

      <Section tone="carvao">
        <MapsCta invert />
      </Section>

      <FamilyStrip exclude="hotel" />
    </>
  );
}

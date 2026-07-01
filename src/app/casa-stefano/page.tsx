import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { MapsCta } from "@/components/MapsCta";
import { FamilyStrip } from "@/components/FamilyStrip";
import { UNITS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Casa Stefano — espaço de eventos em São Roque",
  description:
    "Momentos inesquecíveis esperam por você. Casamentos, eventos sociais e corporativos cercados pela natureza.",
};

const atalhos = UNITS.casa.nav.filter(
  (n) => !["Home", "Contato e Orçamento"].includes(n.label),
);

const destaques = [
  { src: "/images/casa/casamento-1.jpg", alt: "Casamento na Casa Stefano" },
  { src: "/images/casa/estrutura-1.jpg", alt: "Estrutura do salão" },
  { src: "/images/casa/buffet-1.jpg", alt: "Buffet assinado pelos chefs" },
];

export default function CasaHome() {
  return (
    <>
      <Hero
        eyebrow="Espaço de eventos"
        title="momentos inesquecíveis esperam por você"
        subtitle="A apenas 60 km de São Paulo, no interior de São Roque, cercado pela natureza."
        image="/images/casa/casamento-2.jpg"
      />

      <Section>
        <SectionHeading
          eyebrow="Casa Stefano"
          title="Explore nossa Casa"
          subtitle="Um espaço versátil e completo para transformar sua celebração em uma experiência inesquecível."
        />
        <div className="flex flex-wrap justify-center gap-3">
          {atalhos.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded-full border border-dourado/40 px-5 py-2.5 text-sm text-bordo transition-colors hover:bg-bordo hover:text-creme"
            >
              {a.label}
            </Link>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {destaques.map((d) => (
            <div
              key={d.src}
              className="overflow-hidden rounded-sm shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.src}
                alt={d.alt}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section tone="carvao">
        <MapsCta invert />
      </Section>

      <FamilyStrip exclude="casa" />
    </>
  );
}

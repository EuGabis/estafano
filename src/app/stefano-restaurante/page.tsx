import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { MapsCta } from "@/components/MapsCta";
import { FamilyStrip } from "@/components/FamilyStrip";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Stefano Restaurante — gastronomia piemontesa",
  description:
    "Saboreie a típica comida piemontesa feita por autênticos italianos, desde 1953 em São Roque/SP.",
};

const horarios = [
  { dia: "Terça a quinta-feira", h: "almoço das 12h às 15h" },
  { dia: "Sexta-feira", h: "almoço das 12h às 15h · jantar das 19h às 22h" },
  { dia: "Sábado", h: "almoço das 12h às 16h · jantar das 19h às 22h" },
  { dia: "Domingo", h: "almoço das 12h às 16h" },
];

const pratos = [
  { src: "/images/rest/lasagna.png", nome: "Lasagna à Moda" },
  { src: "/images/rest/cannelloni.png", nome: "Cannelloni de Carne" },
  { src: "/images/rest/tortelli.png", nome: "Tortelli na Manteiga" },
  { src: "/images/rest/salada.png", nome: "Salada de Peras" },
];

export default function RestauranteHome() {
  return (
    <>
      <Hero
        eyebrow="Desde 1953 · autênticos italianos"
        title="saboreie a típica comida piemontesa feita por autênticos italianos"
        subtitle="Uma tradição familiar que atravessa gerações no coração de São Roque."
        image="/images/rest/galeria-1.jpg"
      />

      <Section>
        <SectionHeading
          eyebrow="Cozinha piemontesa"
          title="Sabores que contam uma história"
          subtitle="Receitas trazidas da região do Piemonte, no norte da Itália, preparadas com ingredientes frescos — muitos deles cultivados em nossa própria horta orgânica, livre de agrotóxicos."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {pratos.map((p) => (
            <figure
              key={p.nome}
              className="overflow-hidden rounded-sm border border-dourado/20 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.nome}
                className="aspect-square w-full object-cover"
              />
              <figcaption className="px-3 py-3 text-center text-sm text-bordo">
                {p.nome}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section tone="bordo">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="eyebrow text-dourado-light">Atendimento</span>
            <h2 className="mt-3 font-serif text-3xl text-creme md:text-4xl">
              Horário de funcionamento
            </h2>
            <div className="rule-gold ml-0" />
            <ul className="mt-8 divide-y divide-creme/15">
              {horarios.map((h) => (
                <li
                  key={h.dia}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium text-dourado-light">
                    {h.dia}
                  </span>
                  <span className="text-sm text-creme/80">{h.h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-sm shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/rest/cafe.jpg"
              alt="Ambiente do Stefano Restaurante"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/stefano-restaurante/contato" variant="outline">
            Reserve sua mesa
          </Button>
        </div>
      </Section>

      <Section tone="carvao">
        <MapsCta invert />
      </Section>

      <FamilyStrip exclude="restaurante" />
    </>
  );
}

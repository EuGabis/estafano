import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Lazer e Comodidades — Hotel Stefano",
  description:
    "Um espaço completo para toda a família: piscina, playground, sala de convivência, salão de jogos e restaurante.",
};

const comodidades = [
  {
    nome: "Piscina",
    img: "/images/hotel/piscina.jpg",
    desc: "Relaxe e refresque-se em nossa piscina cercada pela natureza.",
  },
  {
    nome: "Playground",
    img: "/images/hotel/playground.jpg",
    desc: "Diversão garantida para as crianças em um espaço seguro.",
  },
  {
    nome: "Sala de convivência",
    img: "/images/hotel/convivencia.jpg",
    desc: "Um ambiente aconchegante para momentos em família.",
  },
  {
    nome: "Salão de jogos",
    img: "/images/hotel/jogos.jpg",
    desc: "Entretenimento para todas as idades.",
  },
  {
    nome: "Restaurante",
    img: "/images/hotel/restaurante.jpg",
    desc: "A tradicional cozinha piemontesa dentro do complexo.",
  },
];

export default function LazerComodidades() {
  return (
    <>
      <Hero
        eyebrow="Lazer e comodidades"
        title="Lazer e comodidades"
        subtitle="aproveite cada momento"
        image="/images/hotel/home-3.jpg"
        height="short"
      />

      <Section>
        <div className="mx-auto mb-14 max-w-3xl space-y-3 text-center">
          <p className="text-lg leading-relaxed text-carvao/85">
            Contamos com um espaço completo para toda a família aproveitar bons
            momentos ao nosso lado.
          </p>
          <p className="text-base text-carvao/70">
            Confira a estrutura do Hotel Stefano e faça sua reserva.
          </p>
        </div>

        <div className="space-y-6">
          {comodidades.map((c, i) => (
            <div
              key={c.nome}
              className="grid items-center gap-8 md:grid-cols-2"
            >
              <div className={i % 2 ? "md:order-2" : ""}>
                <div className="overflow-hidden rounded-sm shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.img}
                    alt={c.nome}
                    className="aspect-[16/10] w-full object-cover"
                  />
                </div>
              </div>
              <div className={i % 2 ? "md:order-1" : ""}>
                <span className="eyebrow">Comodidade</span>
                <h2 className="mt-2 font-serif text-3xl capitalize text-bordo">
                  {c.nome}
                </h2>
                <div className="rule-gold ml-0" />
                <p className="mt-4 leading-relaxed text-carvao/80">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button href="/hotel-stefano/reservas">Faça sua reserva</Button>
        </div>
      </Section>

      <FamilyStrip exclude="hotel" />
    </>
  );
}

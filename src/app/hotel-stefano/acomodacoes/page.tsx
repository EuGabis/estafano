import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Acomodações — Hotel Stefano",
  description:
    "Suíte Deluxe, Suíte Deluxe Família e Suíte Standard. Conforto e tranquilidade aliados à cozinha piemontesa.",
};

type Room = {
  nome: string;
  imagem: string;
  amenidades: string[];
};

const rooms: Room[] = [
  {
    nome: "Suíte Deluxe",
    imagem: "/images/hotel/deluxe-1.png",
    amenidades: [
      "Cama Queen Size",
      'TV 32" com canais pagos',
      "Varanda",
      "Secador",
      "Wi-Fi",
      "Capacidade: 2 pessoas",
      "Frigobar",
      "Ar condicionado",
      "20m²",
    ],
  },
  {
    nome: "Suíte Deluxe Família",
    imagem: "/images/hotel/familia-1.png",
    amenidades: [
      "Cama Queen Size",
      'TV 32" com canais pagos',
      "Wi-Fi",
      "Secador",
      "Capacidade: 3 a 4 pessoas",
      "Frigobar",
      "Ar condicionado",
      "23m²",
    ],
  },
  {
    nome: "Suíte Standard",
    imagem: "/images/hotel/standard-1.png",
    amenidades: [
      "Cama casal padrão",
      'TV 32"',
      "Wi-Fi",
      "Secador",
      "Capacidade: 2 a 3 pessoas",
      "20m²",
    ],
  },
];

export default function Acomodacoes() {
  return (
    <>
      <Hero
        eyebrow="Acomodações"
        title="Acomodações"
        subtitle="sua casa fora de casa"
        image="/images/hotel/deluxe-2.png"
        height="short"
      />

      <Section>
        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-carvao/85">
          Seja a lazer ou a trabalho, o Hotel Stefano é o lugar certo para você
          que procura tranquilidade e conforto para descansar aliados à saborosa
          e festejada cozinha piemontesa. Localizado no Km 56 da Rodovia Raposo
          Tavares, no município de São Roque (interior de São Paulo – a 60 min
          da Capital), nosso hotel está aberto todos os dias para atendê-lo.
        </p>
      </Section>

      <Section tone="creme" className="pt-0">
        <div className="space-y-10">
          {rooms.map((room, i) => (
            <div
              key={room.nome}
              className="grid overflow-hidden rounded-sm border border-dourado/25 bg-white shadow-sm md:grid-cols-2"
            >
              <div className={i % 2 ? "md:order-2" : ""}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.imagem}
                  alt={room.nome}
                  className="h-full min-h-[240px] w-full object-cover"
                />
              </div>
              <div className="p-8 md:p-10">
                <h2 className="font-serif text-2xl text-bordo md:text-3xl">
                  {room.nome}
                </h2>
                <div className="rule-gold ml-0" />
                <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-carvao/80">
                  {room.amenidades.map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <span className="mt-1 text-dourado">✦</span>
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button href="/hotel-stefano/reservas" variant="outline">
                    Reservar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <FamilyStrip exclude="hotel" />
    </>
  );
}

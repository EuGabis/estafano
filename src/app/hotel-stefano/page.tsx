import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { MapsCta } from "@/components/MapsCta";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";
import { Gallery, type GalleryImage } from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Hotel Stefano — tranquilidade em meio à natureza",
  description:
    "Tranquilidade e conforto em meio à natureza, no Km 56 da Rodovia Raposo Tavares, em São Roque/SP.",
};

const galeria: GalleryImage[] = [
  { src: "/images/hotel/home-1.jpg", alt: "Hotel Stefano" },
  { src: "/images/hotel/home-3.jpg", alt: "Área do hotel" },
  { src: "/images/hotel/home-4.jpg", alt: "Natureza ao redor" },
  { src: "/images/hotel/home-5.jpg", alt: "Estrutura do hotel" },
  { src: "/images/hotel/piscina.jpg", alt: "Piscina" },
  { src: "/images/hotel/acom-1.jpg", alt: "Acomodação" },
];

export default function HotelHome() {
  return (
    <>
      <Hero
        eyebrow="Hotel Stefano · São Roque"
        title="tranquilidade e conforto em meio a natureza"
        subtitle="Seja a lazer ou a trabalho, o lugar certo para descansar aliado à saborosa cozinha piemontesa."
        image="/images/hotel/home-2.jpg"
      />

      <Section>
        <SectionHeading
          eyebrow="Bem-vindo"
          title="Sua casa fora de casa"
          subtitle="Localizado no Km 56 da Rodovia Raposo Tavares, no município de São Roque, a 60 minutos da Capital, nosso hotel está aberto todos os dias para atendê-lo."
        />
        <Gallery images={galeria} />
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button href="/hotel-stefano/acomodacoes" variant="outline">
            Ver acomodações
          </Button>
          <Button href="/hotel-stefano/reservas">Faça sua reserva</Button>
        </div>
      </Section>

      <Section tone="carvao">
        <MapsCta invert />
      </Section>

      <FamilyStrip exclude="hotel" />
    </>
  );
}

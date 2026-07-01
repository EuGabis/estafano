import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Galeria — Stefano Restaurante",
  description:
    "Confira pratos de dar água na boca, sobremesas inesquecíveis e ambientes pensados para você relaxar.",
};

const images: GalleryImage[] = [
  { src: "/images/rest/lasagna.png", alt: "Lasagna à Moda" },
  { src: "/images/rest/cannelloni.png", alt: "Cannelloni de Carne" },
  { src: "/images/rest/tortelli.png", alt: "Tortelli na Manteiga" },
  { src: "/images/rest/salada.png", alt: "Salada de Peras" },
  { src: "/images/rest/doce.png", alt: "Doce de Castanhas" },
  { src: "/images/rest/galeria-1.jpg", alt: "Ambiente do restaurante" },
  { src: "/images/rest/galeria-2.jpg", alt: "Ambiente do restaurante" },
  { src: "/images/rest/galeria-3.jpg", alt: "Ambiente do restaurante" },
  { src: "/images/rest/cafe.jpg", alt: "Café da manhã" },
];

export default function GaleriaRestaurante() {
  return (
    <>
      <Hero
        eyebrow="Galeria"
        title="Um pouco do nosso dia a dia"
        subtitle="Aqui no Stefano Restaurante, você e sua família passarão agradáveis horas de lazer e prazer."
        image="/images/rest/galeria-2.jpg"
        height="short"
      />

      <Section>
        <SectionHeading
          title="Confira nossos pratos e ambientes"
          subtitle="Pratos de dar água na boca, sobremesas inesquecíveis e ambientes pensados especialmente para você relaxar e curtir."
        />
        <Gallery images={images} />
        <div className="mt-12 flex justify-center">
          <Button href="/stefano-restaurante/contato">Entre em contato</Button>
        </div>
      </Section>

      <FamilyStrip exclude="restaurante" />
    </>
  );
}

import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Buffet — Casa Stefano",
  description:
    "Buffet assinado pelos chefs Stefano e Franco Bruzzone, famosos pela clássica culinária italiana desde 1960.",
};

const galeria: GalleryImage[] = [
  { src: "/images/casa/buffet-1.jpg", alt: "Prato do buffet" },
  { src: "/images/casa/buffet-2.jpg", alt: "Buffet Casa Stefano" },
  { src: "/images/casa/buffet-3.jpg", alt: "Gastronomia italiana" },
  { src: "/images/casa/buffet-4.jpg", alt: "Mesa de buffet" },
  { src: "/images/casa/buffet-5.jpg", alt: "Delícias do buffet" },
  { src: "/images/casa/mesa.jpg", alt: "Mesa posta" },
];

export default function Buffet() {
  return (
    <>
      <Hero
        eyebrow="Gastronomia"
        title="buffet"
        subtitle="um dos pontos altos da Casa Stefano é a gastronomia"
        image="/images/casa/buffet-1.jpg"
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <p className="text-lg leading-relaxed text-carvao/85">
            Atendendo os mais exigentes paladares, o buffet da Casa Stefano é
            todo assinado pelos chefs Stefano e Franco Bruzzone – chefs à frente
            do tradicional Stefano Restaurante, desde 1960 na cidade de São
            Roque e famosos pela clássica culinária italiana.
          </p>
          <p className="text-lg leading-relaxed text-carvao/85">
            Nossos eventos podem contar com diferentes sistemas de buffet, de
            acordo com a necessidade e desejo de cada cliente.
          </p>
          <p className="text-base text-carvao/70">
            Confira abaixo nossa galeria de fotos com as delícias assinadas
            pelos chefs em eventos já realizados.
          </p>
        </div>
      </Section>

      <Section tone="creme" className="pt-0">
        <SectionHeading title="Delícias assinadas pelos chefs" />
        <Gallery images={galeria} />
        <div className="mt-12 flex justify-center">
          <Button href="/casa-stefano/contato-e-orcamento">
            Solicite um orçamento
          </Button>
        </div>
      </Section>

      <FamilyStrip exclude="casa" />
    </>
  );
}

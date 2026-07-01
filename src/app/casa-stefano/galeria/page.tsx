import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Galeria — Casa Stefano",
  description:
    "Momentos especiais pedem comemorações inesquecíveis. Confira nossa galeria.",
};

const galeria: GalleryImage[] = [
  { src: "/images/casa/casamento-1.jpg", alt: "Casamento" },
  { src: "/images/casa/casamento-2.jpg", alt: "Casamento" },
  { src: "/images/casa/casamento-3.jpg", alt: "Casamento" },
  { src: "/images/casa/casamento-4.jpg", alt: "Casamento" },
  { src: "/images/casa/casamento-5.jpg", alt: "Casamento" },
  { src: "/images/casa/casamento-6.jpg", alt: "Casamento" },
  { src: "/images/casa/buffet-1.jpg", alt: "Buffet" },
  { src: "/images/casa/buffet-3.jpg", alt: "Buffet" },
  { src: "/images/casa/buffet-5.jpg", alt: "Buffet" },
  { src: "/images/casa/sociais-2.jpg", alt: "Evento social" },
  { src: "/images/casa/sociais-3.jpg", alt: "Evento social" },
  { src: "/images/casa/bolo.jpg", alt: "Bolo de festa" },
];

export default function GaleriaCasa() {
  return (
    <>
      <Hero
        eyebrow="Galeria"
        title="Galeria"
        subtitle="momentos especiais, pedem comemorações inesquecíveis"
        image="/images/casa/casamento-6.jpg"
        height="short"
      />

      <Section>
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <p className="text-lg leading-relaxed text-carvao/85">
            Nosso espaço de eventos está localizado no interior de São Roque e a
            apenas 60 KM de São Paulo e oferece o que há de melhor quando o
            assunto é celebrar.
          </p>
          <p className="text-base text-carvao/70">
            Confira momentos únicos e de muita celebração aqui na Casa Stefano.
          </p>
        </div>
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

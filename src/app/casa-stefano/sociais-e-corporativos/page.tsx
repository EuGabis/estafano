import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { FeatureGrid, type Feature } from "@/components/FeatureGrid";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Sociais e Corporativos — Casa Stefano",
  description:
    "Espaço versátil para os mais diferentes tipos de eventos sociais e corporativos.",
};

const tipos: Feature[] = [
  { title: "Corporativos e Sociais" },
  { title: "Reuniões de negócios" },
  { title: "Aniversários" },
  { title: "Bodas" },
  { title: "Batizados" },
  { title: "Noivados" },
  { title: "Chá de Cozinha ou Chá Bar" },
];

const galeria: GalleryImage[] = [
  { src: "/images/casa/sociais-1.jpg", alt: "Evento social" },
  { src: "/images/casa/sociais-2.jpg", alt: "Evento corporativo" },
  { src: "/images/casa/sociais-3.jpg", alt: "Celebração" },
  { src: "/images/casa/sociais-4.jpg", alt: "Festa de aniversário" },
  { src: "/images/casa/banda.jpg", alt: "Banda ao vivo" },
  { src: "/images/casa/vinho.jpg", alt: "Vinho da casa" },
];

export default function SociaisCorporativos() {
  return (
    <>
      <Hero
        eyebrow="Casa Stefano"
        title="sociais e corporativos"
        subtitle="eventos de acordo com a sua necessidade"
        image="/images/casa/sociais-1.jpg"
      />

      <Section>
        <SectionHeading
          title="Versátil para todo tipo de evento"
          subtitle="Nosso espaço é versátil e perfeito para os mais diferentes tipos de eventos. Com salão amplo e completa infraestrutura, estamos preparados para a realização de eventos como:"
        />
        <FeatureGrid features={tipos} columns={4} />
      </Section>

      <Section tone="creme" className="pt-0">
        <SectionHeading
          eyebrow="Galeria"
          title="Quem manda aqui, é a sua criatividade!"
          subtitle="Confira abaixo algumas fotos de eventos já realizados."
        />
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

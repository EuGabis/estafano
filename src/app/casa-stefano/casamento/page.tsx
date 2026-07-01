import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { SplitBlock } from "@/components/SplitBlock";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Casamento — Casa Stefano",
  description:
    "Se você sonha com um casamento rodeado pela natureza, seja bem-vindo à nossa Casa.",
};

const galeria: GalleryImage[] = [
  { src: "/images/casa/casamento-1.jpg", alt: "Cerimônia de casamento" },
  { src: "/images/casa/casamento-3.jpg", alt: "Decoração de casamento" },
  { src: "/images/casa/casamento-4.jpg", alt: "Casamento ao ar livre" },
  { src: "/images/casa/casamento-5.jpg", alt: "Festa de casamento" },
  { src: "/images/casa/casamento-6.jpg", alt: "Recepção de casamento" },
  { src: "/images/casa/bolo.jpg", alt: "Bolo de casamento" },
  { src: "/images/casa/mesa.jpg", alt: "Mesa posta" },
  { src: "/images/casa/banda.jpg", alt: "Banda ao vivo" },
  { src: "/images/casa/vinho.jpg", alt: "Vinho da casa" },
];

export default function Casamento() {
  return (
    <>
      <Hero
        eyebrow="Casa Stefano"
        title="Casamento"
        subtitle="momentos inesquecíveis esperam por você"
        image="/images/casa/casamento-4.jpg"
      />

      <Section>
        <p className="mx-auto max-w-3xl text-center font-serif text-2xl leading-relaxed text-bordo md:text-3xl">
          Se você sonha com um casamento rodeado pela natureza, cercado de
          imponentes árvores e um visual de tirar o fôlego, seja bem-vindo à
          nossa Casa.
        </p>
      </Section>

      <Section tone="creme" className="pt-0">
        <div className="space-y-20">
          <SplitBlock
            image="/images/casa/casamento-5.jpg"
            alt="Cerimônia de casamento"
            eyebrow="Cerimônia"
            title="Onde sonhos se tornam realidade"
          >
            <p>
              Na nossa Casa é onde sonhos se tornam realidade. A apenas 60 KM
              de São Paulo, a Casa Stefano é local ideal para quem busca se
              casar no interior de São Paulo, oferecendo comodidade para os
              convidados.
            </p>
          </SplitBlock>

          <SplitBlock
            image="/images/casa/buffet-2.jpg"
            alt="Buffet de casamento"
            eyebrow="Buffet"
            title="Uma experiência completa"
            reverse
          >
            <p>
              Além do nosso espaço de eventos, aqui em nosso complexo você pode
              contar com o <strong>Hotel Stefano</strong>, ideal para noivos e
              convidados se hospedarem, e o <strong>Stefano Restaurante</strong>{" "}
              para desfrutar de momentos prazerosos antes e depois do grande
              dia.
            </p>
          </SplitBlock>
        </div>
      </Section>

      <Section tone="creme" className="pt-0">
        <SectionHeading eyebrow="Decoração" title="Momentos que ficam" />
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

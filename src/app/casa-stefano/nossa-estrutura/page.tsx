import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { SplitBlock } from "@/components/SplitBlock";
import { PillList } from "@/components/FeatureGrid";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Nossa Estrutura — Casa Stefano",
  description:
    "Salão com mais de 250m² para até 130 pessoas, mobiliário completo, hotel no mesmo complexo e 40 vagas de estacionamento.",
};

const mobiliario = [
  "Mesas",
  "Aparadores",
  "Bancos",
  "Banquetas",
  "Baú",
  "Bistrô",
  "Cadeiras",
  "Poltronas",
  "Sofás",
];

const intro = [
  "O espaço de eventos Casa Stefano foi projetado para atender diferentes gostos com um único objetivo: uma festa inesquecível.",
  "Cercado pela beleza estonteante da natureza, o cenário é imponente e perfeito para fotos maravilhosas.",
  "Nosso salão tem vista para natureza e conta com mais de 250m², acomodando até 130 pessoas confortavelmente.",
];

export default function NossaEstrutura() {
  return (
    <>
      <Hero
        eyebrow="Estrutura"
        title="Estrutura"
        subtitle="nosso maior prazer é servir e não há nada melhor que servir em nossa própria Casa"
        image="/images/casa/estrutura-2.jpg"
      />

      <Section>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {intro.map((t) => (
            <p
              key={t}
              className="text-center text-base leading-relaxed text-carvao/80"
            >
              {t}
            </p>
          ))}
        </div>
      </Section>

      <Section tone="creme" className="pt-0">
        <SplitBlock
          image="/images/casa/estrutura-3.jpg"
          alt="O espaço da Casa Stefano"
          eyebrow="O Espaço"
          title="Mobiliário disponível para locação"
        >
          <p>
            Disponibilizamos para o seu evento um mobiliário completo. Dessa
            forma, você pode utilizá-los como desejar, sem se preocupar com
            locações externas.
          </p>
          <PillList items={mobiliario} />
        </SplitBlock>
      </Section>

      <Section tone="bordo">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <span className="eyebrow text-dourado-light">Hotel</span>
            <h3 className="mt-3 font-serif text-2xl text-creme">
              Descanse no mesmo complexo
            </h3>
            <p className="mt-4 leading-relaxed text-creme/80">
              Nada melhor do que sair da festa e já poder descansar. Nosso
              hotel está localizado no mesmo complexo do espaço de eventos,
              oferecendo conforto e comodidade para você e seus convidados.
            </p>
          </div>
          <div>
            <span className="eyebrow text-dourado-light">Estacionamento</span>
            <h3 className="mt-3 font-serif text-2xl text-creme">
              40 vagas <span className="text-dourado">·</span> amplo e seguro
            </h3>
            <p className="mt-4 leading-relaxed text-creme/80">
              Nosso espaço conta com amplo estacionamento proporcionando
              facilidade e conforto para os convidados.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <p className="mx-auto max-w-2xl text-center font-serif text-2xl text-bordo md:text-3xl">
          A Casa Stefano é o espaço de eventos mais completo de São Roque!
        </p>
        <div className="mt-10 flex justify-center">
          <Button href="/casa-stefano/contato-e-orcamento">
            Solicite um orçamento
          </Button>
        </div>
      </Section>

      <FamilyStrip exclude="casa" />
    </>
  );
}

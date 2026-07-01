import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { FeatureGrid, type Feature } from "@/components/FeatureGrid";
import { Button } from "@/components/Button";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Nosso Espaço — Stefano Restaurante",
  description:
    "Muito mais que um restaurante: playground, espaço pet friendly, horta orgânica, estacionamento, empório e hotel.",
};

const espacos: Feature[] = [
  {
    title: "Play ground",
    text: "Os adultos podem almoçar tranquilamente enquanto as crianças se divertem em nosso playground.",
  },
  {
    title: "Espaço Pet Friendly",
    text: "Leve seu melhor amigo para curtir bons momentos ao seu lado, temos certeza que ele vai amar.",
  },
  {
    title: "Horta",
    text: "Todas as hortaliças servidas no restaurante são cultivadas na nossa horta orgânica, 100% livre de agrotóxicos.",
  },
  {
    title: "Estacionamento",
    text: "Conforto e comodidade para você curtir nosso espaço com tranquilidade.",
  },
  {
    title: "Empório",
    text: "Leve um pedacinho da Itália e do Stefano Restaurante para sua casa.",
  },
  {
    title: "Hotel",
    text: "Seja a lazer ou a trabalho, nosso Hotel é perfeito para desfrutar de momentos inesquecíveis.",
  },
];

export default function NossoEspaco() {
  return (
    <>
      <Hero
        eyebrow="Nosso espaço"
        title="conheça nosso Espaço"
        subtitle="Muito mais que um restaurante, aqui oferecemos uma experiência completa e inesquecível para nossos clientes."
        image="/images/rest/galeria-3.jpg"
        height="short"
      />

      <Section>
        <SectionHeading
          eyebrow="Estrutura"
          title="Uma experiência completa"
        />
        <FeatureGrid features={espacos} />
        <div className="mt-12 flex justify-center">
          <Button href="/stefano-restaurante/contato">Entre em contato</Button>
        </div>
      </Section>

      <FamilyStrip exclude="restaurante" />
    </>
  );
}

import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "Nossa História — Stefano Restaurante",
  description:
    "Conheça a história da família Stefano, do imigrante italiano que chegou ao Brasil em 1953 ao restaurante de hoje.",
};

const historia = [
  "O ano que o imigrante italiano Stefano veio visitar o Brasil, e resolveu aqui permanecer, deixando para nós a arte da cozinha italiana, em especial o famoso cannellone.",
  "No dia cinco de maio de 1953, Stefano Borsarelli veio para o Brasil, deixando para trás a querida Mondovì, pequena cidade da Província de Cuneo, região do Piemonte, no norte ocidental da Itália.",
  "O primeiro restaurante em que Stefano trabalhou quando chegou ao Brasil foi o “Fasano”, na Vieira de Carvalho, na matriz.",
  "A paixão pela gastronomia veio de uma tradição familiar, quando ajudava o avó paterno e um dos tios, que tinham restaurantes.",
  "Em seis de janeiro de 1954, Dia de Reis, Elda e a pequena Daniela chegam ao Brasil, para alegria de Stefano.",
  "Nos anos 60, Stefano havia contraído uma bronquite, e foi solicitado pelo médico que fizesse “uma troca de ares”.",
  "Inicialmente não ganhavam para poder pagar o aluguel. Com o tempo foram fazendo uma freguesia, e aos poucos compraram um terreno aonde viria a ser construído o atual restaurante, em dezembro de 1965.",
  "Stefano gostava de cuidar de tudo, acompanhar de perto, ir às mesas, ele conhecia todos os seus clientes.",
  "Ao longo de todos esses anos, o Restaurante Stefano fez parte da vida de muitas pessoas, não somente dos clientes que o frequentam, mas também de seus funcionários. Ele tem como característica marcante a “Família”.",
  "Atualmente, a família dá continuidade ao sonho de Stefano, que era unir a qualidade, a hospitalidade e a amizade a todos que adentravam a sua casa.",
  "Um dos detalhes importantes na história é a horta, na qual são cultivados cuidadosamente as verduras e legumes, e com um detalhe muito importante: sem agrotóxicos.",
  "Não é por acaso que os clientes antigos são frequentadores assíduos do restaurante, e com eles acompanham seus filhos, netos e bisnetos.",
  "Afinal, em quase 50 anos, são muitas páginas de história que ficarão na memória das pessoas.",
  "A lembrança de um homem chamado Stefano, que esteve neste mundo um dia e partiu feliz, pois conseguiu deixar plantada a sementinha da esperança.",
  "E atualmente segue nutrida muito carinho por sua filha Daniela, Guido e toda a família.",
];

export default function NossaHistoria() {
  return (
    <>
      <Hero
        eyebrow="Nossa história"
        title="conheça a nossa história"
        image="/images/rest/chef.png"
        height="short"
      />

      <Section>
        <div className="mb-14 text-center">
          <p className="font-serif text-6xl tracking-[0.3em] text-dourado md:text-8xl">
            1953
          </p>
          <div className="rule-gold" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-3 top-2 hidden h-full w-px bg-dourado/30 md:block" />
          <div className="space-y-8">
            {historia.map((p, i) => (
              <div key={i} className="relative md:pl-12">
                <span className="absolute left-0 top-2 hidden h-6 w-6 items-center justify-center rounded-full border border-dourado bg-creme text-xs text-dourado md:flex">
                  ✦
                </span>
                <p className="text-lg leading-relaxed text-carvao/85">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <FamilyStrip exclude="restaurante" />
    </>
  );
}

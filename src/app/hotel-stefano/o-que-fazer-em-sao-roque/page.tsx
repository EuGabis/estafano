import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { FamilyStrip } from "@/components/FamilyStrip";

export const metadata: Metadata = {
  title: "O que fazer em São Roque — Hotel Stefano",
  description:
    "Dez atrações imperdíveis para conhecer na estância turística de São Roque durante sua estadia.",
};

const atracoes = [
  {
    nome: "Portal de São Roque",
    texto:
      "Um passeio turístico de respeito precisa ter visita ao cartão postal da cidade que, neste caso, é o Portal de São Roque. É porta de entrada para uma viagem encantadora. E merece uma parada obrigatória para garantir um lindo clique.",
    img: "/images/hotel/sr-1.png",
  },
  {
    nome: "Estação Ferroviária de São Roque",
    texto:
      "Quer entrar em uma viagem no tempo e visitar uma arquitetura antiga típica de uma estação ferroviária? Este é o lugar ideal. A Estação Ferroviária está desativada há mais de 22 anos e, desde então, se transformou na atração de São Roque. Quando construída, em 1930, transportava os passageiros até a Estação Ferroviária de Sorocabana. Atualmente abriga a Guarda Municipal e recebe inúmeros turistas que buscam se conectar com a beleza clássica da região.",
    img: "/images/hotel/sr-2.png",
  },
  {
    nome: "Morro do Cruzeiro",
    texto:
      "Quer ter uma vista privilegiada de São Roque? O Morro do Cruzeiro está localizado a 550 metros da Estação Ferroviária e permite ver toda a cidade de uma outra perspectiva. No alto do morro tem a imagem de São Roque, o santo padroeiro da cidade e a famosa cruz, que atrai turistas para fotografar.",
    img: "/images/hotel/sr-3.png",
  },
  {
    nome: "Igreja Matriz de São Roque",
    texto:
      "Pensou em lugares para visitar em São Roque, então pensou na Igreja Matriz. Essa é tradição, por se tratar da maior igreja do Brasil dedicada ao santo. As pinturas presentes nas paredes e no teto foram feitas por dois irmãos italianos, os artistas plásticos Gentili. Os desenhos demonstram a vida de São Roque aqui na terra e proporcionam ao interior um local encantador.",
    img: "/images/hotel/sr-4.png",
  },
  {
    nome: "Rota do Vinho",
    texto:
      "Amantes de vinho têm uma parada mais do que obrigatória na cidade: a rota do vinho. Porém, o local é tão tradicional, que recebe turistas de todo o Brasil, mesmo os que não são adeptos à uva. Afinal, contemplar a paisagem é uma das formas de aproveitar o local.",
    img: "/images/hotel/sr-5.png",
  },
  {
    nome: "Trilha e Mirante do Morro do Saboó",
    texto:
      "Gosta de aventura e está em busca de algo diferenciado? O Morro do Saboó é uma das opções. Ele está localizado a mais de mil metros de altitude e para chegar até lá é preciso fazer uma trilha de nível médio. O espaço fica em uma propriedade privada, mas a entrada é gratuita. Após a aventura, ao chegar no topo do morro, você se depara com uma vista incrível da natureza e de cidades vizinhas.",
    img: "/images/hotel/sr-6.png",
  },
  {
    nome: "Recanto da Cascata",
    texto:
      "Se você prefere paz e calmaria, uma opção imperdível é visitar o Recanto da Cascata. Ele é cercado pela natureza e possui uma cascata das águas do Ribeirão Carambeí. O banho não é permitido, mas toda a paisagem torna o ambiente reconfortante. Há também trilhas, jardins e uma estrutura que recebe diversos eventos de São Roque. O local ainda recebe uma feirinha aos domingos, das 9h às 16h.",
    img: "/images/hotel/sr-7.png",
  },
  {
    nome: "Casa Grande e Capela do Sítio de Sto Antônio",
    texto:
      "O local é um patrimônio cultural construído em 1640. É um dos mais importantes sítios Bandeirista, que representa um modelo de arquitetura colonial rural paulista. Além de visitar o local, você sai de lá abastecido de informações, pois as visitações ocorrem com guias que contam toda a história deste importante ponto turístico da cidade.",
    img: "/images/hotel/sr-8.png",
  },
  {
    nome: "Catarina Fashion Outlet",
    texto:
      "Você é do tipo que se divertir significa ir às compras? Aqui também temos uma boa opção. O Catarina Fashion Outlet é a melhor escolha da região para quem deseja se conectar com a moda e encher o carrinho. O estabelecimento foi eleito 4x o melhor outlet do Brasil. Então vale a pena ir conferir de pertinho.",
    img: "/images/hotel/sr-9.jpg",
  },
  {
    nome: "Ski Mountain Park",
    texto:
      "O parque está em uma das belas montanhas da cidade, a 1.200m acima do nível do mar, sendo que a parte dos 320 mil/m² é de mata atlântica nativa. O Ski oferece aos visitantes a oportunidade de desfrutar dos prazeres deste paraíso ecológico, além da linda vista panorâmica de São Roque. Os visitantes encontram atrações para todas as idades e gostos.",
    img: "/images/hotel/sr-1.png",
  },
];

export default function OQueFazer() {
  return (
    <>
      <Hero
        eyebrow="Turismo em São Roque"
        title="o que fazer em SÃO ROQUE"
        subtitle="Durante sua estadia, descubra as principais atrações da estância turística."
        image="/images/hotel/sr-5.png"
        height="short"
      />

      <Section>
        <div className="space-y-14">
          {atracoes.map((a, i) => (
            <article
              key={a.nome}
              className="grid items-center gap-8 md:grid-cols-2"
            >
              <div className={i % 2 ? "md:order-2" : ""}>
                <div className="overflow-hidden rounded-sm shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.img}
                    alt={a.nome}
                    className="aspect-[16/10] w-full object-cover"
                  />
                </div>
              </div>
              <div className={i % 2 ? "md:order-1" : ""}>
                <span className="eyebrow">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 font-serif text-2xl text-bordo md:text-3xl">
                  {a.nome}
                </h2>
                <div className="rule-gold ml-0" />
                <p className="mt-4 leading-relaxed text-carvao/80">{a.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <FamilyStrip exclude="hotel" />
    </>
  );
}

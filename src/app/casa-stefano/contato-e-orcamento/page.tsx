import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { ContactForm, type ContactField } from "@/components/ContactForm";
import { MapsCta } from "@/components/MapsCta";

export const metadata: Metadata = {
  title: "Contato e Orçamento — Casa Stefano",
  description:
    "Conte para nós um pouco do que você deseja e logo entraremos em contato. Solicite um orçamento.",
};

const casaEmail = "casastefano@familiastefano.com.br";

const fields: ContactField[] = [
  { name: "nome", label: "Nome" },
  { name: "email", label: "E-mail", type: "email" },
  { name: "telefone", label: "Telefone", type: "tel" },
  {
    name: "tipo",
    label: "Tipo de evento",
    type: "select",
    options: [
      "Casamento",
      "Aniversário",
      "Bodas",
      "Corporativo",
      "Batizado",
      "Noivado",
      "Outro",
    ],
  },
  { name: "convidados", label: "Nº estimado de convidados" },
  { name: "data", label: "Data estimada", type: "date" },
  { name: "mensagem", label: "Mensagem", type: "textarea" },
];

export default function ContatoOrcamento() {
  return (
    <>
      <Hero
        eyebrow="Casa Stefano"
        title="Contato e Orçamento"
        subtitle="nosso intuito é proporcionar o melhor momento da sua vida, aqui, na nossa Casa"
        height="short"
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed text-carvao/85">
              Conte para nós um pouco do que você deseja e logo entraremos em
              contato.
            </p>
            <p className="mt-2 text-sm text-carvao/70">
              Preencha o formulário abaixo para solicitar um orçamento:
            </p>
            <div className="mt-8">
              <ContactForm fields={fields} to={casaEmail} />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="eyebrow text-dourado-dark">Contato</h3>
              <ul className="mt-4 space-y-2 text-sm text-carvao/80">
                <li>Telefone / WhatsApp: (11) 4714-1464</li>
                <li>
                  E-mail:{" "}
                  <a
                    href={`mailto:${casaEmail}`}
                    className="text-bordo hover:underline"
                  >
                    {casaEmail}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="eyebrow text-dourado-dark">Endereço</h3>
              <p className="mt-4 text-sm leading-relaxed text-carvao/80">
                Av. Antônio Pannellini, 2635 - Taboão - São Roque/SP
                <br />
                Rod. Raposo Tavares (altura do KM 56 - sentido São Roque)
              </p>
            </div>
            <div className="overflow-hidden rounded-sm shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/casa/buffet-3.jpg"
                alt="Casa Stefano"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="carvao">
        <MapsCta invert />
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { MapsCta } from "@/components/MapsCta";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato — Stefano Restaurante",
  description:
    "Fale conosco. Preencha seus dados e em breve retornaremos o contato.",
};

const horarios = [
  "Terça a quinta-feira: almoço das 12h às 15h",
  "Sexta-feira: almoço das 12h às 15h | jantar das 19h às 22h",
  "Sábado: almoço das 12h às 16h | jantar das 19h às 22h",
  "Domingo: almoço das 12h às 16h",
];

export default function ContatoRestaurante() {
  return (
    <>
      <Hero
        eyebrow="Fale conosco"
        title="Fale Conosco"
        subtitle="Preencha seus dados abaixo e em breve retornaremos o contato."
        height="short"
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Formulário</span>
            <h2 className="mt-3 font-serif text-2xl text-bordo md:text-3xl">
              Envie sua mensagem
            </h2>
            <div className="rule-gold ml-0" />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="eyebrow text-dourado-dark">
                Horário de Funcionamento
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-carvao/80">
                {horarios.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow text-dourado-dark">Contato</h3>
              <ul className="mt-4 space-y-2 text-sm text-carvao/80">
                <li>
                  Telefone:{" "}
                  <a href={SITE.phoneHref} className="text-bordo hover:underline">
                    (11) 4714-1464
                  </a>
                </li>
                <li>
                  WhatsApp:{" "}
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bordo hover:underline"
                  >
                    (11) 4714-1464
                  </a>
                </li>
                <li>
                  E-mail:{" "}
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-bordo hover:underline"
                  >
                    {SITE.email}
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
          </div>
        </div>
      </Section>

      <Section tone="carvao">
        <MapsCta invert />
      </Section>
    </>
  );
}

import Link from "next/link";
import { UNITS, type Unit } from "@/lib/site";

export function FamilyStrip({ exclude }: { exclude?: Unit["key"] }) {
  const others = Object.values(UNITS).filter((u) => u.key !== exclude);
  return (
    <section className="bg-bordo py-16 text-creme">
      <div className="container-max text-center">
        <span className="eyebrow text-dourado-light">Família Stefano</span>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">
          conheça mais sobre nossa família
        </h2>
        <div className="rule-gold" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {others.map((u) => (
            <Link
              key={u.key}
              href={u.base}
              className="group rounded-sm border border-creme/15 bg-bordo-dark/40 p-8 transition-colors hover:border-dourado"
            >
              <h3 className="font-serif text-2xl text-dourado">{u.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-creme/75">
                {u.tagline}
              </p>
              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider2 text-creme/60 transition-colors group-hover:text-dourado">
                Visitar →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

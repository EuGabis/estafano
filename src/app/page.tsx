import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapsCta } from "@/components/MapsCta";
import { UNITS } from "@/lib/site";

const unitImages: Record<string, string> = {
  restaurante: "/images/rest/galeria-1.jpg",
  casa: "/images/portal/casa.png",
  hotel: "/images/portal/hotel.jpg",
};

export default function HomePortal() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-bordo-dark">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/portal/hero.jpg)" }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-bordo-dark/85 via-bordo-dark/60 to-carvao/90"
            aria-hidden
          />
          <div className="container-max relative py-28 text-center">
            <span className="eyebrow text-dourado-light">
              São Roque · Serra da Cantareira do Vinho
            </span>
            <h1 className="mx-auto mt-5 max-w-4xl font-serif text-5xl font-medium leading-[1.05] text-creme md:text-7xl">
              Família Stefano
            </h1>
            <div className="rule-gold" />
            <p className="mx-auto mt-6 max-w-2xl text-lg uppercase tracking-wider2 text-creme/85 md:text-xl">
              sua experiência completa
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-creme/75">
              Três casas, uma só tradição italiana no interior de São Paulo:
              gastronomia piemontesa, celebrações inesquecíveis e hospedagem
              em meio à natureza.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {Object.values(UNITS).map((u) => (
                <Link
                  key={u.key}
                  href={u.base}
                  className="rounded-sm border border-dourado px-6 py-3 text-xs font-semibold uppercase tracking-wider2 text-dourado transition-colors hover:bg-dourado hover:text-carvao"
                >
                  {u.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Units */}
        <section className="bg-creme py-20 md:py-28">
          <div className="container-max">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="eyebrow">Nossas casas</span>
              <h2 className="mt-3 font-serif text-3xl font-medium text-bordo md:text-4xl">
                Uma família, três experiências
              </h2>
              <div className="rule-gold" />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {Object.values(UNITS).map((u) => (
                <Link
                  key={u.key}
                  href={u.base}
                  className="group flex flex-col overflow-hidden rounded-sm border border-dourado/20 bg-white shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={unitImages[u.key]}
                      alt={u.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carvao/70 to-transparent" />
                    <h3 className="absolute bottom-4 left-5 font-serif text-2xl text-creme">
                      {u.name}
                    </h3>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm leading-relaxed text-carvao/75">
                      {u.tagline}
                    </p>
                    <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider2 text-dourado-dark transition-colors group-hover:text-bordo">
                      Conhecer →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-carvao py-16 text-creme">
          <div className="container-max">
            <MapsCta invert />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

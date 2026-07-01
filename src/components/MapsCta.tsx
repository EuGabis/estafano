import { SITE } from "@/lib/site";

export function MapsCta({ invert = false }: { invert?: boolean }) {
  const label = invert ? "text-creme/80" : "text-carvao/70";
  return (
    <div className="flex flex-col items-center gap-4">
      <p className={`text-sm uppercase tracking-wider2 ${label}`}>
        Venha nos visitar e utilize:
      </p>
      <div className="flex gap-4">
        <a
          href={SITE.maps.waze}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm border border-dourado px-5 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-dourado transition-colors hover:bg-dourado hover:text-carvao"
        >
          Waze
        </a>
        <a
          href={SITE.maps.google}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm border border-dourado px-5 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-dourado transition-colors hover:bg-dourado hover:text-carvao"
        >
          Google Maps
        </a>
      </div>
    </div>
  );
}

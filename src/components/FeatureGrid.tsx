export type Feature = { title: string; text?: string };

export function FeatureGrid({
  features,
  columns = 3,
}: {
  features: Feature[];
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-6 ${cols}`}>
      {features.map((f) => (
        <div
          key={f.title}
          className="group rounded-sm border border-dourado/25 bg-white/60 p-6 transition-colors hover:border-dourado hover:bg-white"
        >
          <div className="mb-3 h-8 w-8 rounded-full border border-dourado/60 text-center font-serif text-lg leading-8 text-dourado">
            ✦
          </div>
          <h3 className="text-lg font-medium text-bordo">{f.title}</h3>
          {f.text && (
            <p className="mt-2 text-sm leading-relaxed text-carvao/75">
              {f.text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function PillList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-dourado/40 bg-white/70 px-4 py-2 text-sm text-carvao/80"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

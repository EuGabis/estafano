import { clsx } from "@/lib/clsx";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  height?: "tall" | "short";
  align?: "center" | "left";
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  image,
  height = "tall",
  align = "center",
}: Props) {
  return (
    <section
      className={clsx(
        "relative flex items-center overflow-hidden bg-bordo-dark",
        height === "tall" ? "min-h-[78vh]" : "min-h-[52vh]",
      )}
    >
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-b from-bordo-dark/80 via-bordo-dark/55 to-carvao/90"
        aria-hidden
      />
      <div className="container-max relative py-24">
        <div
          className={clsx(
            "max-w-3xl",
            align === "center" && "mx-auto text-center",
          )}
        >
          {eyebrow && (
            <span className="eyebrow text-dourado-light">{eyebrow}</span>
          )}
          <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.1] text-creme md:text-6xl">
            {title}
          </h1>
          <div
            className={clsx("rule-gold", align === "left" && "ml-0")}
          />
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-creme/85 md:text-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

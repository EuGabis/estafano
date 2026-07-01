import { clsx } from "@/lib/clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "creme" | "bordo" | "carvao";
};

const tones = {
  creme: "bg-creme text-carvao",
  bordo: "bg-bordo text-creme",
  carvao: "bg-carvao text-creme",
};

export function Section({ children, className, id, tone = "creme" }: Props) {
  return (
    <section id={id} className={clsx("py-16 md:py-24", tones[tone], className)}>
      <div className="container-max">{children}</div>
    </section>
  );
}

type HeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  invert?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  invert,
}: HeadingProps) {
  return (
    <div
      className={clsx(
        "mb-12 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={clsx(
          "mt-3 text-3xl font-medium leading-tight md:text-4xl lg:text-5xl",
          invert ? "text-creme" : "text-bordo",
        )}
      >
        {title}
      </h2>
      <div className={clsx("rule-gold", align === "left" && "ml-0")} />
      {subtitle && (
        <p
          className={clsx(
            "mt-6 text-base leading-relaxed md:text-lg",
            invert ? "text-creme/80" : "text-carvao/75",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

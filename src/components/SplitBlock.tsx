import { clsx } from "@/lib/clsx";

type Props = {
  image: string;
  alt: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  reverse?: boolean;
};

export function SplitBlock({
  image,
  alt,
  eyebrow,
  title,
  children,
  reverse,
}: Props) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
      <div className={clsx(reverse && "md:order-2")}>
        <div className="overflow-hidden rounded-sm shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={alt}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
      <div className={clsx(reverse && "md:order-1")}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="mt-3 font-serif text-2xl font-medium text-bordo md:text-3xl">
          {title}
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-carvao/80">
          {children}
        </div>
      </div>
    </div>
  );
}

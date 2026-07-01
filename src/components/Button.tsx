import Link from "next/link";
import { clsx } from "@/lib/clsx";

type Variant = "solid" | "outline" | "ghost";

const styles: Record<Variant, string> = {
  solid:
    "bg-dourado text-carvao hover:bg-dourado-dark hover:text-creme border border-dourado",
  outline:
    "border border-dourado text-dourado hover:bg-dourado hover:text-carvao",
  ghost: "text-dourado hover:text-dourado-light",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "solid",
  external,
  className,
}: Props) {
  const cls = clsx(
    "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-xs font-semibold uppercase tracking-wider2 transition-colors duration-300",
    styles[variant],
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

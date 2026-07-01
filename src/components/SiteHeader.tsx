"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UNITS, type Unit } from "@/lib/site";
import { clsx } from "@/lib/clsx";

type Props = {
  unit?: Unit["key"];
};

export function SiteHeader({ unit }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = unit ? UNITS[unit] : null;
  const nav = current?.nav ?? [];

  const isActive = (href: string) =>
    href === current?.base
      ? pathname === href || pathname === `${href}/`
      : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-dourado/20 bg-bordo-dark/95 backdrop-blur">
      <div className="container-max flex h-20 items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-xl tracking-wide text-creme md:text-2xl">
            Família Stefano
          </span>
          <span className="text-[10px] uppercase tracking-wider2 text-dourado">
            {current ? current.name : "sua experiência completa"}
          </span>
        </Link>

        {nav.length > 0 && (
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "link-underline text-sm text-creme/85 transition-colors hover:text-dourado",
                  isActive(item.href) && "text-dourado",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-dourado lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span
              className={clsx(
                "block h-0.5 w-6 bg-current transition-transform",
                open && "translate-y-2 rotate-45",
              )}
            />
            <span
              className={clsx(
                "block h-0.5 w-6 bg-current transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={clsx(
                "block h-0.5 w-6 bg-current transition-transform",
                open && "-translate-y-2 -rotate-45",
              )}
            />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-dourado/20 bg-bordo-dark lg:hidden">
          <div className="container-max flex flex-col py-4">
            {(nav.length > 0 ? nav : defaultMobileNav).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm text-creme/85 hover:text-dourado"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

const defaultMobileNav = [
  { label: "Stefano Restaurante", href: "/stefano-restaurante" },
  { label: "Casa Stefano", href: "/casa-stefano" },
  { label: "Hotel Stefano", href: "/hotel-stefano" },
];

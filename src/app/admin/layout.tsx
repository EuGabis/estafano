"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession, logout } from "@/lib/booking/admin-auth";

const nav = [
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/quartos", label: "Quartos" },
  { href: "/admin/disponibilidade", label: "Disponibilidade" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    let active = true;
    getSession().then((logged) => {
      if (!active) return;
      if (!logged) router.replace("/admin/login");
      else setReady(true);
    });
    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (pathname === "/admin/login")
    return <div className="min-h-screen bg-creme">{children}</div>;
  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-creme">
      <aside className="hidden w-60 flex-col bg-bordo-dark text-creme md:flex">
        <Link
          href="/"
          className="border-b border-creme/10 p-6 font-serif text-xl text-dourado"
        >
          Stefano · Admin
        </Link>
        <nav className="flex-1 p-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`block rounded-sm px-4 py-2.5 text-sm ${
                pathname.startsWith(n.href)
                  ? "bg-dourado text-carvao"
                  : "text-creme/80 hover:bg-creme/10"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={async () => {
            await logout();
            router.replace("/admin/login");
          }}
          className="m-4 rounded-sm border border-creme/20 px-4 py-2 text-xs uppercase tracking-wider2 text-creme/80 hover:bg-creme/10"
        >
          Sair
        </button>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6 md:p-10">{children}</main>
    </div>
  );
}

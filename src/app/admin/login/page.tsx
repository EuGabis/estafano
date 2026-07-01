"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/booking/admin-auth";

export default function AdminLogin() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [erro, setErro] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(user, pass)) router.replace("/admin/reservas");
    else setErro("Credenciais inválidas.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-lg border border-dourado/30 bg-white p-8 shadow-sm"
      >
        <h1 className="font-serif text-2xl text-bordo">Painel Stefano</h1>
        <p className="mt-1 text-xs text-carvao/60">
          Acesso restrito. (demo: admin / stefano)
        </p>
        <label className="mt-6 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">
            Usuário
          </span>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full rounded-sm border border-carvao/20 px-4 py-2.5 text-sm outline-none focus:border-dourado"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider2 text-bordo">
            Senha
          </span>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full rounded-sm border border-carvao/20 px-4 py-2.5 text-sm outline-none focus:border-dourado"
          />
        </label>
        {erro && <p className="mt-3 text-sm text-bordo">{erro}</p>}
        <button
          type="submit"
          className="mt-6 w-full rounded-sm bg-bordo px-6 py-3 text-xs font-semibold uppercase tracking-wider2 text-creme hover:bg-bordo-light"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

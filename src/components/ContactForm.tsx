"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select" | "date";
  options?: string[];
};

const baseFields: Field[] = [
  { name: "nome", label: "Nome" },
  { name: "email", label: "E-mail", type: "email" },
  { name: "telefone", label: "Telefone", type: "tel" },
  { name: "assunto", label: "Assunto" },
  { name: "mensagem", label: "Mensagem", type: "textarea" },
];

export function ContactForm({
  fields = baseFields,
  to = SITE.email,
  submitLabel = "Enviar",
}: {
  fields?: Field[];
  to?: string;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  const set = (name: string, v: string) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Contato pelo site — ${values.nome ?? ""}`,
    );
    const body = encodeURIComponent(
      fields
        .map((f) => `${f.label}: ${values[f.name] ?? ""}`)
        .join("\n"),
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {fields.map((f) => (
        <div key={f.name} className="flex flex-col">
          <label
            htmlFor={f.name}
            className="mb-1.5 text-xs font-semibold uppercase tracking-wider2 text-bordo"
          >
            {f.label}
          </label>
          {f.type === "textarea" ? (
            <textarea
              id={f.name}
              rows={4}
              value={values[f.name] ?? ""}
              onChange={(e) => set(f.name, e.target.value)}
              className="rounded-sm border border-carvao/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-dourado"
            />
          ) : f.type === "select" ? (
            <select
              id={f.name}
              value={values[f.name] ?? ""}
              onChange={(e) => set(f.name, e.target.value)}
              className="rounded-sm border border-carvao/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-dourado"
            >
              <option value="">Selecione...</option>
              {f.options?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={f.name}
              type={f.type ?? "text"}
              value={values[f.name] ?? ""}
              onChange={(e) => set(f.name, e.target.value)}
              className="rounded-sm border border-carvao/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-dourado"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-sm bg-bordo px-8 py-3 text-xs font-semibold uppercase tracking-wider2 text-creme transition-colors hover:bg-bordo-light"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export type { Field as ContactField };

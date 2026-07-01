"use client";

import { useEffect, useState } from "react";
import {
  getRoomTypes,
  upsertRoomType,
  deleteRoomType,
} from "@/lib/booking/api";
import type { RoomType } from "@/lib/booking/types";
import { brl } from "@/lib/booking/format";

const vazio: RoomType = {
  id: "",
  nome: "",
  slug: "",
  descricao: "",
  capacidade: 2,
  tamanhoM2: 20,
  amenidades: [],
  fotos: [],
  precoBase: 300,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminQuartos() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [form, setForm] = useState<RoomType>(vazio);
  const [editing, setEditing] = useState(false);

  const load = () => getRoomTypes().then(setRooms);
  useEffect(() => {
    load();
  }, []);

  const edit = (r: RoomType) => {
    setForm(r);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const reset = () => {
    setForm(vazio);
    setEditing(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.id || slugify(form.nome) || `quarto-${Date.now()}`;
    await upsertRoomType({ ...form, id, slug: slugify(form.nome) || id });
    reset();
    load();
  };

  const remove = async (id: string) => {
    await deleteRoomType(id);
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-bordo">Quartos</h1>

      <form
        onSubmit={save}
        className="mt-6 grid gap-4 rounded-lg border border-dourado/25 bg-white p-6 md:grid-cols-2"
      >
        <h2 className="font-serif text-xl text-bordo md:col-span-2">
          {editing ? "Editar quarto" : "Novo quarto"}
        </h2>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-bordo">
            Nome
          </span>
          <input
            required
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-bordo">
            Preço base (R$/noite)
          </span>
          <input
            required
            type="number"
            min={0}
            value={form.precoBase}
            onChange={(e) =>
              setForm({ ...form, precoBase: Number(e.target.value) })
            }
            className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-bordo">
            Capacidade
          </span>
          <input
            required
            type="number"
            min={1}
            value={form.capacidade}
            onChange={(e) =>
              setForm({ ...form, capacidade: Number(e.target.value) })
            }
            className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-bordo">
            Tamanho (m²)
          </span>
          <input
            required
            type="number"
            min={1}
            value={form.tamanhoM2}
            onChange={(e) =>
              setForm({ ...form, tamanhoM2: Number(e.target.value) })
            }
            className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase text-bordo">
            Descrição
          </span>
          <textarea
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase text-bordo">
            Amenidades (separadas por vírgula)
          </span>
          <input
            value={form.amenidades.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                amenidades: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase text-bordo">
            Fotos (uma URL por linha)
          </span>
          <textarea
            value={form.fotos.join("\n")}
            onChange={(e) =>
              setForm({
                ...form,
                fotos: e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className="w-full rounded-sm border border-carvao/20 px-3 py-2 text-sm"
          />
        </label>
        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-sm bg-bordo px-6 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-creme hover:bg-bordo-light"
          >
            Salvar
          </button>
          {editing && (
            <button
              type="button"
              onClick={reset}
              className="rounded-sm border border-carvao/30 px-6 py-2.5 text-xs uppercase tracking-wider2 text-carvao/70"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((r) => (
          <div
            key={r.id}
            className="overflow-hidden rounded-lg border border-dourado/20 bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {r.fotos[0] && (
              <img
                src={r.fotos[0]}
                alt={r.nome}
                className="aspect-[4/3] w-full object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-serif text-lg text-bordo">{r.nome}</h3>
              <p className="text-sm text-carvao/60">
                {brl(r.precoBase)}/noite · até {r.capacidade} · {r.tamanhoM2}m²
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => edit(r)}
                  className="rounded-sm border border-dourado px-3 py-1.5 text-xs text-dourado-dark hover:bg-dourado hover:text-carvao"
                >
                  Editar
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="rounded-sm border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  getRoomTypes,
  listOverrides,
  setDayOverride,
} from "@/lib/booking/api";
import type { DayOverride, RoomType } from "@/lib/booking/types";
import { MonthCalendar } from "@/components/booking/MonthCalendar";
import { formatBR } from "@/lib/booking/dates";

export default function AdminDisponibilidade() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [roomId, setRoomId] = useState("");
  const [overrides, setOverrides] = useState<DayOverride[]>([]);
  const now = new Date();
  const [ym, setYm] = useState({
    year: now.getUTCFullYear(),
    month: now.getUTCMonth(),
  });
  const [sel, setSel] = useState<{
    date: string;
    blocked: boolean;
    price: string;
  } | null>(null);

  useEffect(() => {
    getRoomTypes().then((r) => {
      setRooms(r);
      if (r[0]) setRoomId(r[0].id);
    });
  }, []);

  const loadOv = (id: string) => listOverrides(id).then(setOverrides);
  useEffect(() => {
    if (roomId) loadOv(roomId);
  }, [roomId]);

  const pick = (date: string) => {
    const ov = overrides.find((o) => o.date === date);
    setSel({
      date,
      blocked: !!ov?.blocked,
      price: ov?.price != null ? String(ov.price) : "",
    });
  };

  const salvar = async () => {
    if (!sel) return;
    await setDayOverride({
      roomTypeId: roomId,
      date: sel.date,
      blocked: sel.blocked || undefined,
      price: sel.price ? Number(sel.price) : undefined,
    });
    setSel(null);
    loadOv(roomId);
  };

  const nav = (delta: number) =>
    setYm((s) => {
      const m = s.month + delta;
      return {
        year: s.year + Math.floor(m / 12),
        month: ((m % 12) + 12) % 12,
      };
    });

  return (
    <div>
      <h1 className="font-serif text-3xl text-bordo">
        Disponibilidade &amp; Tarifas
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="rounded-sm border border-carvao/20 px-3 py-2 text-sm"
        >
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => nav(-1)}
            className="rounded-sm border border-carvao/20 px-3 py-1.5 text-sm"
          >
            ‹
          </button>
          <span className="min-w-[140px] text-center text-sm font-medium capitalize text-bordo">
            {new Intl.DateTimeFormat("pt-BR", {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(Date.UTC(ym.year, ym.month, 1)))}
          </span>
          <button
            onClick={() => nav(1)}
            className="rounded-sm border border-carvao/20 px-3 py-1.5 text-sm"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="rounded-lg border border-dourado/20 bg-white p-4">
          <MonthCalendar
            year={ym.year}
            month={ym.month}
            overrides={overrides}
            onPickDay={pick}
          />
        </div>
        <aside className="h-fit rounded-lg border border-dourado/25 bg-white p-6">
          {sel ? (
            <>
              <h3 className="font-serif text-lg text-bordo">
                {formatBR(sel.date)}
              </h3>
              <label className="mt-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sel.blocked}
                  onChange={(e) =>
                    setSel({ ...sel, blocked: e.target.checked })
                  }
                />{" "}
                Bloquear este dia
              </label>
              <label className="mt-4 block text-sm">
                <span className="mb-1 block text-xs font-semibold uppercase text-bordo">
                  Preço especial (R$)
                </span>
                <input
                  type="number"
                  min={0}
                  value={sel.price}
                  onChange={(e) => setSel({ ...sel, price: e.target.value })}
                  className="w-full rounded-sm border border-carvao/20 px-3 py-2"
                />
              </label>
              <button
                onClick={salvar}
                className="mt-5 w-full rounded-sm bg-bordo px-4 py-2.5 text-xs font-semibold uppercase tracking-wider2 text-creme hover:bg-bordo-light"
              >
                Salvar dia
              </button>
            </>
          ) : (
            <p className="text-sm text-carvao/60">
              Clique num dia do calendário para bloquear ou definir um preço
              especial.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  listReservations,
  updateReservationStatus,
  getRoomTypes,
} from "@/lib/booking/api";
import type {
  Reservation,
  ReservationStatus,
  RoomType,
} from "@/lib/booking/types";
import { brl } from "@/lib/booking/format";
import { formatBR } from "@/lib/booking/dates";

const STATUSES: ReservationStatus[] = ["pendente", "confirmada", "cancelada"];
const badge: Record<ReservationStatus, string> = {
  pendente: "bg-amber-100 text-amber-800",
  confirmada: "bg-green-100 text-green-800",
  cancelada: "bg-red-100 text-red-700",
};

export default function AdminReservas() {
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [filtro, setFiltro] = useState<ReservationStatus | "todas">("todas");
  const [busca, setBusca] = useState("");

  const load = () => listReservations().then(setReservas);
  useEffect(() => {
    load();
    getRoomTypes().then(setRooms);
  }, []);

  const roomName = (id: string) => rooms.find((r) => r.id === id)?.nome ?? id;

  const filtradas = useMemo(
    () =>
      reservas.filter(
        (r) =>
          (filtro === "todas" || r.status === filtro) &&
          (busca === "" ||
            r.codigo.toLowerCase().includes(busca.toLowerCase()) ||
            r.guest.nome.toLowerCase().includes(busca.toLowerCase())),
      ),
    [reservas, filtro, busca],
  );

  const setStatus = async (id: string, status: ReservationStatus) => {
    await updateReservationStatus(id, status);
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-bordo">Reservas</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={filtro}
          onChange={(e) =>
            setFiltro(e.target.value as ReservationStatus | "todas")
          }
          className="rounded-sm border border-carvao/20 px-3 py-2 text-sm"
        >
          <option value="todas">Todas</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          placeholder="Buscar código ou nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 rounded-sm border border-carvao/20 px-3 py-2 text-sm"
        />
      </div>

      {filtradas.length === 0 ? (
        <p className="mt-10 text-carvao/60">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-dourado/20 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-creme text-xs uppercase tracking-wider text-carvao/60">
              <tr>
                {[
                  "Código",
                  "Hóspede",
                  "Quarto",
                  "Check-in",
                  "Check-out",
                  "Total",
                  "Status",
                ].map((h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((r) => (
                <tr key={r.id} className="border-t border-carvao/10">
                  <td className="px-4 py-3 font-medium text-bordo">{r.codigo}</td>
                  <td className="px-4 py-3">
                    {r.guest.nome}
                    <br />
                    <span className="text-xs text-carvao/50">
                      {r.guest.email}
                    </span>
                  </td>
                  <td className="px-4 py-3">{roomName(r.roomTypeId)}</td>
                  <td className="px-4 py-3">{formatBR(r.checkin)}</td>
                  <td className="px-4 py-3">{formatBR(r.checkout)}</td>
                  <td className="px-4 py-3">{brl(r.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        setStatus(r.id, e.target.value as ReservationStatus)
                      }
                      className={`rounded-full px-2 py-1 text-xs ${badge[r.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

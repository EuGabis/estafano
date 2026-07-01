"use client";

import type { DayOverride } from "@/lib/booking/types";

const WEEK = ["D", "S", "T", "Q", "Q", "S", "S"];

export function MonthCalendar({
  year,
  month,
  overrides,
  onPickDay,
}: {
  year: number;
  month: number; // 0-11
  overrides: DayOverride[];
  onPickDay: (iso: string) => void;
}) {
  const first = new Date(Date.UTC(year, month, 1));
  const startDow = first.getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) {
    cells.push(
      `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    );
  }
  const ovOf = (iso: string) => overrides.find((o) => o.date === iso);

  return (
    <div>
      <div className="grid grid-cols-7 text-center text-xs text-carvao/50">
        {WEEK.map((w, i) => (
          <div key={i} className="py-2">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((iso, i) =>
          iso === null ? (
            <div key={i} />
          ) : (
            <button
              key={iso}
              onClick={() => onPickDay(iso)}
              className={`flex h-16 flex-col items-start rounded-sm border p-1.5 text-left text-xs transition-colors ${
                ovOf(iso)?.blocked
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-carvao/15 hover:border-dourado"
              }`}
            >
              <span className="font-medium">{Number(iso.slice(-2))}</span>
              {ovOf(iso)?.blocked && <span className="mt-auto">Bloqueado</span>}
              {typeof ovOf(iso)?.price === "number" && (
                <span className="mt-auto text-dourado-dark">
                  R$ {ovOf(iso)!.price}
                </span>
              )}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

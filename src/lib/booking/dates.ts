export function toISO(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function nightsBetween(checkin: string, checkout: string): number {
  const ms = parseISO(checkout).getTime() - parseISO(checkin).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function eachDate(checkin: string, checkout: string): string[] {
  const out: string[] = [];
  let cur = parseISO(checkin);
  const end = parseISO(checkout);
  while (cur.getTime() < end.getTime()) {
    out.push(toISO(cur));
    cur = new Date(cur.getTime() + 86_400_000);
  }
  return out;
}

export function isValidRange(checkin: string, checkout: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(checkin) &&
    /^\d{4}-\d{2}-\d{2}$/.test(checkout) &&
    parseISO(checkout).getTime() > parseISO(checkin).getTime()
  );
}

export function addDays(iso: string, n: number): string {
  return toISO(new Date(parseISO(iso).getTime() + n * 86_400_000));
}

export function formatBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

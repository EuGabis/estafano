const KEY = "stefano.booking.admin";

export function isLogged(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function login(user: string, pass: string): boolean {
  const ok = user === "admin" && pass === "stefano";
  if (ok && typeof window !== "undefined") window.localStorage.setItem(KEY, "1");
  return ok;
}

export function logout(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

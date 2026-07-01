import { supabase } from "../supabase/client";

export async function login(email: string, senha: string): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });
  return !error;
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export function onAuthChange(cb: (logged: boolean) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_e, session) =>
    cb(!!session),
  );
  return () => data.subscription.unsubscribe();
}

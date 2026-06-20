import { supabase } from '../config/supabase';

export async function signIn(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) throw error;
  return data;
}

export async function signUp(nome: string, email: string, senha: string) {
  const { data, error } = await supabase.auth.signUp({ email, password: senha });
  if (error) throw error;

  if (data.user) {
    const { error: insertError } = await supabase
      .from('inspetores')
      .insert({ id: data.user.id, nome, email });
    if (insertError) throw insertError;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

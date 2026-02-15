import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ RYŪKAMI: Supabase credentials missing. \n' +
    '1. Asegúrate de tener un archivo .env en la raíz.\n' +
    '2. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.\n' +
    '3. Reinicia tu servidor de desarrollo (Bun / Vite).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

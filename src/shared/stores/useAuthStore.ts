import { create } from 'zustand';
import { supabase } from '@/api/supabase';
import { AuthState } from './auth.types';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  _subscription: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
  initialize: () => {
    // Evitar múltiples suscripciones (Memory Leak Fix)
    const currentSub = get()._subscription;
    if (currentSub) {
      currentSub.unsubscribe();
    }

    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, isLoading: false });
    });

    // Suscribirse a cambios
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, isLoading: false });
    });

    set({ _subscription: subscription });
  },
}));

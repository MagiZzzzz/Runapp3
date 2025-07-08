// File: src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const AuthContext = createContext({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // À l'initialisation, on restaure la session existante
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Écoute des changements de session (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password });

  const signOut = () =>
    supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour accéder au contexte
export function useAuth() {
  return useContext(AuthContext);
}

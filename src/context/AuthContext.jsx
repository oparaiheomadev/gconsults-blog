import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ADMIN_EMAIL } from '@/lib/constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // who is logged in right now?
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // keep it updated on sign in / sign out
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  const isAdmin =
    Boolean(user) && user.email?.toLowerCase() === ADMIN_EMAIL?.toLowerCase();
  // console.log('logged in as:', user?.email, '| admin email:', ADMIN_EMAIL);
  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [role,    setRole]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ── Restore session on mount ───────────────────────────
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));

    // ── Listen for auth changes (login / logout) ──────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setLoading(true);
          fetchRole(session.user.id);
        } else {
          setUser(null);
          setRole(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    // Safety timeout — if Supabase doesn't respond in 5s, unblock UI
    const timeout = setTimeout(() => {
      console.warn('fetchRole timed out — allowing access check');
      setLoading(false);
    }, 5000);

    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      clearTimeout(timeout);

      if (error) {
        console.warn('fetchRole error:', error.message);
        setRole(null);
      } else {
        setRole(data?.role ?? null);
      }
    } catch (err) {
      clearTimeout(timeout);
      console.warn('fetchRole exception:', err.message);
      setRole(null);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      signIn,
      signOut,
      isAdmin:      ['super_admin', 'admin', 'editor'].includes(role),
      isSuperAdmin: role === 'super_admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

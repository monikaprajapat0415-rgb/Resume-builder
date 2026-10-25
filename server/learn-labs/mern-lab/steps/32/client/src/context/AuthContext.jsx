import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // false while we check a saved token

  // On first load: if there is a saved token, ask the server who it belongs to.
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      if (!getToken()) { setReady(true); return; }
      try {
        const res = await api('/auth/me', { signal: controller.signal });
        setUser(res.user);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setToken(null); // the token is no good any more
      }
      setReady(true);
    })();
    return () => controller.abort();
  }, []);

  const signOut = useCallback(() => { setToken(null); setUser(null); }, []);

  // If any request later gets a 401, sign out so the person lands on the login page.
  useEffect(() => {
    window.addEventListener('jt:unauthorized', signOut);
    return () => window.removeEventListener('jt:unauthorized', signOut);
  }, [signOut]);

  const signIn = useCallback(async (email, password) => {
    const res = await api('/auth/login', { method: 'POST', body: { email, password } });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await api('/auth/register', { method: 'POST', body: { name, email, password } });
    setToken(res.token);
    setUser(res.user);
  }, []);

  return <AuthContext.Provider value={{ user, ready, signIn, register, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

import { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken } from '../api.js';

// Context shares a value with every component below it, without passing props through each level.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // false until we have tried to sign in

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        // TEMPORARY: sign in as the demo user from `npm run seed`. Lesson 32 replaces this with real sign-in pages.
        const res = await api('/auth/login', { method: 'POST', body: { email: 'demo@example.com', password: 'Demo12345' }, signal: controller.signal });
        setToken(res.token);
        setUser(res.user);
      } catch { /* the pages show their own errors */ }
      if (!controller.signal.aborted) setReady(true);
    })();
    return () => controller.abort();
  }, []);

  return <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>;
}

// A custom hook: a function whose name starts with "use" and that calls other hooks.
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

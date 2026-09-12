import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'watebank_prototype_session_v1';
const AuthContext = createContext(null);

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupted session
  }
  return { role: null, memberId: null };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const loginAsStaff = () => setSession({ role: 'staff', memberId: null });
  const loginAsMember = (memberId) => setSession({ role: 'member', memberId });
  const switchRole = (role, memberId = null) => setSession({ role, memberId });
  const logout = () => setSession({ role: null, memberId: null });

  return (
    <AuthContext.Provider
      value={{ session, loginAsStaff, loginAsMember, switchRole, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth ต้องถูกใช้ภายใน AuthProvider');
  return ctx;
}

import { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    // If Firebase is not configured (empty .env), resolve to no-user after 1s
    if (!auth) {
      const t = setTimeout(() => setUser(null), 1000);
      return () => clearTimeout(t);
    }

    // Fallback: if Firebase never calls back within 3s, resolve to no-user
    const timeout = setTimeout(() => {
      setUser((prev) => (prev === undefined ? null : prev));
    }, 3000);

    const unsub = onAuthStateChanged(auth, (u) => {
      clearTimeout(timeout);
      setUser(u);
      setEmailVerified(u?.emailVerified ?? false);
    });

    return () => {
      clearTimeout(timeout);
      unsub();
    };
  }, []);

  const logout = () => auth && signOut(auth);

  return (
    <AuthContext.Provider value={{ user, emailVerified, logout, loading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);



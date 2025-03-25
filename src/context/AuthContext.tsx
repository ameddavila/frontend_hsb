"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCsrfToken, login as loginRequest, logout as logoutRequest, refreshAccessToken } from "@/services/api";

interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  handleLogin: (usernameOrEmail: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await refreshAccessToken();
        setUser(data.user);
      } catch (e) {
        console.warn("🔒 No se pudo refrescar el token:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    initialize();
  }, []);
  

  const handleLogin = async (usernameOrEmail: string, password: string) => {
    await getCsrfToken();
    const data = await loginRequest(usernameOrEmail, password);
    await new Promise((res) => setTimeout(res, 200));
    await getCsrfToken();
    setUser(data.user);
  };

  const handleLogout = async () => {
    await logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

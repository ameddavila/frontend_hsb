"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getCsrfToken,
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken,
} from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export interface User {
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const initialize = async (context: string = "default") => {
    console.log(`🧠 Ejecutando initialize() desde: ${context}`);
    try {
      const data = await refreshAccessToken();
      if (data?.id) {
        setUser({
          userId: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        });
  
        console.log("✅ Usuario restaurado:", data.username);
  
        if (context === "pageshow (bfcache)") {
          toast.success("✅ Sesión restaurada correctamente");
        }
      } else {
        console.log("⚠️ No se recibió usuario válido");
        setUser(null);
      }
    } catch (e) {
      console.warn("❌ Error al refrescar sesión:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    initialize("mount");
  }, []);

  // ✅ Manejo robusto para back/forward cache
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  
      const isBfCache = event.persisted || navEntry?.type === "back_forward";
  
      if (isBfCache) {
        console.log("🔁 Detectado back/forward navigation → revalidando sesión...");
        initialize("pageshow (bfcache)");
      }
    };
  
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);
  

  const handleLogin = async (usernameOrEmail: string, password: string) => {
    const oldToken = document.cookie.match(/(^| )csrfToken=([^;]+)/)?.[2];
    console.log("🕵️ CSRF antes de login (modo público):", oldToken);

    await getCsrfToken();

    const data = await loginRequest(usernameOrEmail, password);
    await new Promise((r) => setTimeout(r, 200));

    const newToken = document.cookie.match(/(^| )csrfToken=([^;]+)/)?.[2];
    console.log("🔐 CSRF después de login (modo user):", newToken);

    setUser({
      userId: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    });

    router.push("/dashboard");
  };

  const handleLogout = async () => {
    await logoutRequest();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return context;
};

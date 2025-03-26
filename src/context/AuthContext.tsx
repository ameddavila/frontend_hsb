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

const waitForCookies = async (cookieNames: string[], maxWait = 2000) => {
  const interval = 100;
  let waited = 0;
  while (waited < maxWait) {
    const cookies = document.cookie;
    const found = cookieNames.every((name) =>
      new RegExp(`(^| )${name}=`).test(cookies)
    );
    if (found) return true;
    await new Promise((r) => setTimeout(r, interval));
    waited += interval;
  }
  return false;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const initialize = async (context: string = "default") => {
    console.log(`🔄 Ejecutando initialize() desde: ${context}`);

    // Evita refrescar en /login
    if (window.location.pathname === "/login") {
      console.log("📌 En /login, se omite refreshAccessToken");
      setLoading(false);
      return;
    }

    console.log("⏳ Esperando cookies para refresh...");
    const cookiesReady = await waitForCookies(["refreshToken", "csrfToken"]);
    if (!cookiesReady) {
      console.warn("⚠️ Cookies refreshToken o csrfToken no disponibles. Cancelando refresh.");
      setLoading(false);
      return;
    }

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
          toast.success("♻️ Sesión restaurada correctamente");
        }
      } else {
        console.warn("⚠️ No se recibió usuario válido.");
        setUser(null);
      }
    } catch (e) {
      console.error("❌ Error al refrescar token:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize("mount");
  }, []);

  useEffect(() => {
    const handlePageShow = async (event: PageTransitionEvent) => {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const isBfCache = event.persisted || navEntry?.type === "back_forward";

      if (isBfCache) {
        console.log("♻️ Navegación desde historial detectada");
        await initialize("pageshow (bfcache)");
        window.dispatchEvent(new Event("session-restored"));
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleLogin = async (usernameOrEmail: string, password: string) => {
    const before = document.cookie;
    console.log("🕵️ CSRF antes del login:", before);

    await getCsrfToken();
    const data = await loginRequest(usernameOrEmail, password);
    await new Promise((r) => setTimeout(r, 200)); // espera ligera para set de cookies

    const after = document.cookie;
    console.log("🔐 CSRF después del login:", after);

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

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import {
  getCsrfToken,
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken,
} from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { waitForCookie, waitForAllCookies  } from "@/utils/waitForCookie";


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

const waitForCookies = async (
  names: string[],
  maxWait = 2000
): Promise<boolean> => {
  const results = await Promise.all(
    names.map((name) => waitForCookie(name, maxWait))
  );
  return results.every((cookie) => Boolean(cookie));
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshAttempts = useRef(0);
  const MAX_ATTEMPTS = 5;
  const RETRY_DELAY = 400;

  const initialize = async (context: string = "default") => {
    console.log(`🔄 Ejecutando initialize() desde: ${context}`);
  
    const pathname = window.location.pathname;
    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/recover");
  
    if (isPublic) {
      console.log("📌 En ruta pública, se omite initialize()");
      setLoading(false);
      return;
    }
  
    console.log("⏳ Esperando cookies para refresh...");
    const cookiesReady = await waitForAllCookies(["refreshToken", "csrfToken"], 3000);
  
    if (!cookiesReady) {
      if (refreshAttempts.current >= MAX_ATTEMPTS) {
        console.error("❌ Demasiados intentos fallidos. Cancelando refresh.");
        setLoading(false);
        return;
      }
  
      console.warn(`⚠️ Cookies no disponibles aún. Reintentando en ${RETRY_DELAY}ms...`);
      refreshAttempts.current++;
      setTimeout(() => initialize(`retry-${refreshAttempts.current}`), RETRY_DELAY);
      return;
    }
  
    try {
      const data = await refreshAccessToken();
  
      // 🕵️ Seguimiento detallado de tokens después del refresh
      const accessToken = document.cookie.match(/(^| )accessToken=([^;]+)/)?.[2];
      const refreshToken = document.cookie.match(/(^| )refreshToken=([^;]+)/)?.[2];
      const csrfToken = document.cookie.match(/(^| )csrfToken=([^;]+)/)?.[2];
  
      console.log("🍪 Tokens tras refresh:");
      console.log("   🔐 accessToken:", accessToken ? "✅ presente" : "❌ ausente");
      console.log("   ♻️ refreshToken:", refreshToken ? "✅ presente" : "❌ ausente");
      console.log("   🛡️ csrfToken:", csrfToken ? `✅ ${csrfToken}` : "❌ ausente");
  
      if (data?.id) {
        setUser({
          userId: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        });
        console.log("✅ Usuario restaurado:", data.username);
  
        // 🔔 Notificar a los hooks
        window.dispatchEvent(new Event("session-ready"));
  
        if (context.includes("bfcache")) {
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
    const pathname = window.location.pathname;
    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/recover");
  
    if (isPublic) {
      console.log("📌 En ruta pública, se omite initialize()");
      setLoading(false);
      return;
    }
  
    const runInitialize = () => {
      if (document.visibilityState === "visible") {
        initialize("mount");
      } else {
        const onVisible = () => {
          initialize("visibility");
          document.removeEventListener("visibilitychange", onVisible);
        };
        document.addEventListener("visibilitychange", onVisible);
      }
    };
  
    // 💡 Ejecutar después de pequeña pausa para permitir cookies
    setTimeout(runInitialize, 100);
  }, []);
  

  useEffect(() => {
    const handlePageShow = async (event: PageTransitionEvent) => {
      const navEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
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

    // ✅ Esperar para garantizar que useMenus se monte
    setTimeout(() => {
      console.log("🟢 Disparando evento session-ready tras login");
      window.dispatchEvent(new Event("session-ready"));
    }, 300);
  };

  const handleLogout = async () => {
    await logoutRequest();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, handleLogin, handleLogout }}
    >
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

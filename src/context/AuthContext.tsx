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
import { waitForAllCookies } from "@/utils/waitForCookie";
import { useMenuStore } from "@/stores/menuStore";

// ======================
// Tipos y contexto base
// ======================

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

// ======================
// Proveedor principal
// ======================

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const refreshAttempts = useRef(0);

  const MAX_ATTEMPTS = 5;
  const RETRY_DELAY = 400;

  const { clearMenus, setMenuLoaded } = useMenuStore.getState();

  // ======================
  // 🔄 Refrescar sesión desde cookies
  // ======================
  const initialize = async (context: string = "default") => {
    console.log(`🔄 initialize(): ${context}`);

    const pathname = window.location.pathname;
    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/recover");

    if (isPublic) {
      console.log("📌 Ruta pública, skip initialize()");
      setLoading(false);
      return;
    }

    const cookiesReady = await waitForAllCookies(["refreshToken", "csrfToken"], 3000);
    if (!cookiesReady) {
      if (refreshAttempts.current >= MAX_ATTEMPTS) {
        console.error("❌ Max reintentos alcanzados. Abortando refresh.");
        setLoading(false);
        return;
      }

      console.warn(`⏳ Cookies no listas. Reintentando en ${RETRY_DELAY}ms...`);
      refreshAttempts.current++;
      setTimeout(() => initialize(`retry-${refreshAttempts.current}`), RETRY_DELAY);
      return;
    }

    try {
      const data = await refreshAccessToken();

      const accessToken = document.cookie.match(/(^| )accessToken=([^;]+)/)?.[2];
      const refreshToken = document.cookie.match(/(^| )refreshToken=([^;]+)/)?.[2];
      const csrfToken = document.cookie.match(/(^| )csrfToken=([^;]+)/)?.[2];

      console.log("🍪 Tokens tras refresh:");
      console.log("   🔐 accessToken:", accessToken ? "✅" : "❌");
      console.log("   ♻️ refreshToken:", refreshToken ? "✅" : "❌");
      console.log("   🛡️ csrfToken:", csrfToken ? `✅ ${csrfToken}` : "❌");

      if (data?.id) {
        setUser({
          userId: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        });
        console.log("✅ Usuario restaurado:", data.username);

        window.dispatchEvent(new Event("session-ready"));

        if (context.includes("bfcache")) {
          toast.success("♻️ Sesión restaurada correctamente");
        }
      } else {
        console.warn("⚠️ No se recibió usuario válido");
        setUser(null);
      }
    } catch (e) {
      console.error("❌ Error al refrescar sesión:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // ✅ Login
  // ======================
  const handleLogin = async (usernameOrEmail: string, password: string) => {
    console.log("🕵️ Iniciando login...");

    await getCsrfToken();
    const data = await loginRequest(usernameOrEmail, password);

    await new Promise((r) => setTimeout(r, 200)); // esperar cookies

    setUser({
      userId: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    });

    // 💾 Limpiar menús antiguos y estado
    localStorage.removeItem("menu-storage");
    clearMenus();
    setMenuLoaded(false);

    router.push("/dashboard");

    setTimeout(() => {
      console.log("🟢 Evento session-ready post-login");
      window.dispatchEvent(new Event("session-ready"));
    }, 400);
  };

  // ======================
  // 🚪 Logout
  // ======================
  const handleLogout = async () => {
    await logoutRequest();
    setUser(null);
    clearMenus();
    setMenuLoaded(false);
    router.push("/login");
  };

  // ======================
  // useEffect: inicializar sesión
  // ======================
  useEffect(() => {
    const pathname = window.location.pathname;
    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/recover");

    if (isPublic) {
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

    setTimeout(runInitialize, 100);
  }, []);

  // ======================
  // useEffect: manejar navegación desde bfcache
  // ======================
  useEffect(() => {
    const handlePageShow = async (event: PageTransitionEvent) => {
      const navEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const isBfCache = event.persisted || navEntry?.type === "back_forward";

      if (isBfCache) {
        console.log("♻️ Navegación desde cache detectada");
        await initialize("pageshow (bfcache)");
        window.dispatchEvent(new Event("session-restored"));
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ======================
// Hook personalizado
// ======================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return context;
};

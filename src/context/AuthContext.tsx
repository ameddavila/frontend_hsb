"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  getCsrfToken,
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken,
} from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMenuStore } from "@/stores/menuStore";
import { useWaitForCookiesReady } from "@/hooks/useWaitForCookiesReady";
import { useUserStore } from "@/stores/userStore";
import { getCookie } from "@/services/api";
import { waitForValidCsrfToken } from "@/utils/waitForCsrfReady";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { clearMenus, setMenuLoaded } = useMenuStore.getState();
  const cookiesReady = useWaitForCookiesReady(["refreshToken", "csrfToken"], 7000);
  const { user, setUser, clearUser } = useUserStore();

  const initialize = useCallback(async (context: string = "default") => {
    const pathname = window.location.pathname;
    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/recover");

    if (isPublic) {
      console.log(`📌 Ruta pública (${pathname}), saltando refresh...`);
      setLoading(false);
      return;
    }

    console.log(`🔄 initialize(): ${context}`);

    try {
      const csrfValido = await waitForValidCsrfToken(2500);
      if (!csrfValido) {
        console.warn("⛔ CSRF aún no es válido. Cancelando restore.");
        setLoading(false);
        return;
      }

      const data = await refreshAccessToken();
      const accessToken = document.cookie.match(/(^| )accessToken=([^;]+)/)?.[2];
      const refreshToken = document.cookie.match(/(^| )refreshToken=([^;]+)/)?.[2];
      const csrfToken = document.cookie.match(/(^| )csrfToken=([^;]+)/)?.[2];

      console.log("🍪 Tokens tras refresh:");
      console.log("   🔐 accessToken:", accessToken ? "✅" : "❌");
      console.log("   ♻️ refreshToken:", refreshToken ? "✅" : "❌");
      console.log("   🛡️ csrfToken:", csrfToken ? `✅ ${csrfToken}` : "❌");

      if (data?.id) {
        const userData = {
          userId: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        };
        setUser(userData);
        await new Promise((r) => setTimeout(r, 200));
        console.log("✅ Usuario restaurado:", data.username);
        window.dispatchEvent(new Event("session-ready"));

        if (context.includes("bfcache")) {
          toast.success("♻️ Sesión restaurada correctamente");
        }
      } else {
        console.warn("⚠️ No se recibió usuario válido");
        clearUser();
      }
    } catch (e) {
      console.error("❌ Error al refrescar sesión:", e);
      clearUser();
    } finally {
      setLoading(false);
    }
  }, [setUser, clearUser]);

  const handleLogin = async (usernameOrEmail: string, password: string) => {
    console.log("🕵️ Iniciando login...");
    await getCsrfToken();
    console.log("🛡️ CSRF público inicial obtenido");
    document.cookie = "csrfToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    const data = await loginRequest(usernameOrEmail, password);
    console.log("✅ Login exitoso, backend envió nuevas cookies");
    await new Promise((resolve) => setTimeout(resolve, 300));
    const csrfActual = getCookie("csrfToken");
    console.log("🔄 CSRF después del login (post-rotación):", csrfActual);
    const userData = {
      userId: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    };
    setUser(userData);
    localStorage.removeItem("menu-storage");
    clearMenus();
    setMenuLoaded(false);
    console.log("🧹 Estado de menús limpiado");
    router.push("/dashboard");
    setTimeout(() => {
      console.log("🟢 Emitiendo evento session-ready (post-login)");
      window.dispatchEvent(new Event("session-ready"));
    }, 400);
  };

  const handleLogout = async () => {
    await logoutRequest();
    setUser(null);
    clearMenus();
    setMenuLoaded(false);
    localStorage.removeItem("menu-storage");
    localStorage.removeItem("user-storage");
    localStorage.removeItem("panel-storage");
    localStorage.removeItem("sidebar-storage");
    router.push("/login");
  };

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

    if (cookiesReady === true) {
      initialize("hook-ready");
    } else if (cookiesReady === false) {
      console.warn("⚠️ Cookies no disponibles. Continuando sin sesión.");
      clearUser();
      setLoading(false);
      window.dispatchEvent(new Event("session-ready"));
    }
  }, [cookiesReady, initialize, clearUser]);

  useEffect(() => {
    const handlePageShow = async (event: PageTransitionEvent) => {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const isBfCache = event.persisted || navEntry?.type === "back_forward";

      if (isBfCache) {
        console.log("♻️ Navegación desde cache detectada");
        await initialize("pageshow (bfcache)");
        window.dispatchEvent(new Event("session-restored"));
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [initialize]);

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return context;
};

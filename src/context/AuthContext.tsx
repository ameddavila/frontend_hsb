// ✅ NUEVA VERSIÓN DE AuthContext.tsx
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
import { useMenuStore } from "@/stores/menuStore";
import { useWaitForCookiesReady } from "@/hooks/useWaitForCookiesReady";
import { useUserStore } from "@/stores/userStore"; // 🆕 Store para persistencia del usuario

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { clearMenus, setMenuLoaded } = useMenuStore.getState();
  const cookiesReady = useWaitForCookiesReady(["refreshToken", "csrfToken"], 7000);

  const { user, setUser, clearUser } = useUserStore(); // 🆕 persistencia de usuario

  // ======================
  // 🔄 Refrescar sesión desde cookies
  // ======================
  const initialize = async (context: string = "default") => {
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
  };

  // ======================
  // ✅ Login
  // ======================
  const handleLogin = async (usernameOrEmail: string, password: string) => {
    console.log("🕵️ Iniciando login...");

    await getCsrfToken();
    const data = await loginRequest(usernameOrEmail, password);

    console.log("✅ Login exitoso, esperando cookies...");
    await new Promise((r) => setTimeout(r, 200));

    const userData = {
      userId: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    };
    setUser(userData);

    console.log("🧹 Limpiando menús previos y estado de carga...");
    localStorage.removeItem("menu-storage");
    clearMenus();
    setMenuLoaded(false);

    router.push("/dashboard");

    setTimeout(() => {
      console.log("🟢 Emitiendo evento session-ready (post-login)");
      window.dispatchEvent(new Event("session-ready"));
    }, 400);
  };

  // ======================
  // 🚪 Logout
  // ======================
  // 🚪 Logout
const handleLogout = async () => {
  await logoutRequest();
  setUser(null);
  clearMenus();
  setMenuLoaded(false);

  // 🧹 Limpiar localStorage persistido (Zustand)
  localStorage.removeItem("menu-storage");
  localStorage.removeItem("user-storage");
  localStorage.removeItem("panel-storage");
  localStorage.removeItem("sidebar-storage");

  router.push("/login");
};


  // ======================
  // useEffect: inicializar sesión si las cookies están listas
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

    if (cookiesReady === true) {
      initialize("hook-ready");
    } else if (cookiesReady === false) {
      console.warn("⚠️ Cookies no disponibles. No se puede refrescar sesión.");
      setLoading(false);
    }
  }, [cookiesReady]);

  // ======================
  // useEffect: manejar navegación desde bfcache
  // ======================
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
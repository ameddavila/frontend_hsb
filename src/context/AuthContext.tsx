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
import { useUserStore } from "@/stores/useUserStore";
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

// =============================
//  CREACIÓN DEL CONTEXTO
// =============================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================
//  PROVEEDOR DEL CONTEXTO
// =============================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Mantén `loading` local, pero el user se obtendrá de la store
  const [loading, setLoading] = useState(true);

  // Router para redirecciones
  const router = useRouter();

  // Store de menús (para limpiar menús tras login/logout)
  const { clearMenus, setMenuLoaded } = useMenuStore.getState();

  // Espera a que existan las cookies "csrfToken"
  const cookiesReady = useWaitForCookiesReady(["csrfToken"], 7000);

  // Store de usuario (fuente única de user)
  const { user, setUser, clearUser } = useUserStore();

  // ─────────────────────────────────────────────────────────────────────────────
  //                     FUNCIÓN PRINCIPAL PARA RESTAURAR SESIÓN
  // ─────────────────────────────────────────────────────────────────────────────
  const initialize = useCallback(async (context: string = "default") => {
    const pathname = window.location.pathname;
    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/recover");
  
    if (isPublic) {
      console.log(`📌 [AuthContext] Ruta pública (${pathname}), saltando refresh...`);
      setLoading(false);
      return;
    }
  
    console.log(`🔄 [AuthContext] initialize(): ${context}`);
  
    try {
      const csrfValido = await waitForValidCsrfToken(2500);
      if (!csrfValido) {
        console.warn("⛔ CSRF aún no es válido. Cancelando restore.");
        setLoading(false);
        return;
      }
  
      const data = await refreshAccessToken();
  
      // Debug tokens (opcional)
      const accessToken = document.cookie.match(/(^| )accessToken=([^;]+)/)?.[2];
      const refreshToken = document.cookie.match(/(^| )refreshToken=([^;]+)/)?.[2];
      const csrfToken = document.cookie.match(/(^| )csrfToken=([^;]+)/)?.[2];
  
      console.log("🍪 Tokens tras refresh:");
      console.log("   🔐 accessToken:", accessToken ? "✅" : "❌");
      console.log("   ♻️ refreshToken:", refreshToken ? "✅" : "❌");
      console.log("   🛡️ csrfToken:", csrfToken ? `✅ ${csrfToken}` : "❌");
  
      const user = data?.user || data; // admite ambos formatos
      if (data?.user?.id) {
        const userData = {
          userId: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
        };
  
        setUser(userData);
  
        // Micro-pausa para asegurar reactividad
        await new Promise((r) => setTimeout(r, 150));
  
        console.log("✅ Usuario restaurado:", userData.username);
  
        window.dispatchEvent(new Event("session-ready"));
  
        if (context.includes("bfcache")) {
          toast.success("♻️ Sesión restaurada correctamente");
        }
      } else {
        console.warn("⚠️ No se recibió usuario válido del refresh");
        clearUser();
        router.push("/login");
        return;
      }
    } catch (e) {
      console.error("❌ Error al refrescar sesión:", e);
      clearUser();
      router.push("/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [setUser, clearUser, router]);
  

  // ─────────────────────────────────────────────────────────────────────────────
  //                     FUNCIÓN PARA HACER LOGIN
  // ─────────────────────────────────────────────────────────────────────────────
  const handleLogin = async (usernameOrEmail: string, password: string) => {
    console.log("🕵️ [AuthContext] Iniciando login...");

    // Pide un CSRF público inicial
    await getCsrfToken();
    console.log("🛡️ [AuthContext] CSRF público inicial obtenido");

    // Borramos cookie csrfToken vieja
    document.cookie = "csrfToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Petición real de login
    const data = await loginRequest(usernameOrEmail, password);
    console.log("✅ [AuthContext] Login exitoso, backend envió nuevas cookies");

    // Esperamos un poco para que las cookies se guarden
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Debug: leer el nuevo CSRF
    const csrfActual = getCookie("csrfToken");
    console.log("🔄 [AuthContext] CSRF después del login (post-rotación):", csrfActual);

    // Cargamos datos de usuario en la store
    const userData = {
      userId: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    };
    setUser(userData);

    // Limpiamos menús y flags
    localStorage.removeItem("menu-storage");
    clearMenus();
    setMenuLoaded(false);

    console.log("🧹 [AuthContext] Menús limpiados tras login");

    // Redirigir a dashboard
    router.push("/dashboard");

    // Emitimos "session-ready"
    setTimeout(() => {
      console.log("🟢 [AuthContext] Emitiendo evento session-ready (post-login)");
      window.dispatchEvent(new Event("session-ready"));
    }, 400);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //                     FUNCIÓN PARA LOGOUT
  // ─────────────────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    console.log("🚪 [AuthContext] Iniciando logout...");

    await logoutRequest();

    // Borrar user, menús y flags
    setUser(null);
    clearMenus();
    setMenuLoaded(false);

    // Limpiamos localStorage
    localStorage.removeItem("menu-storage");
    localStorage.removeItem("user-storage");
    localStorage.removeItem("panel-storage");
    localStorage.removeItem("sidebar-storage");

    console.log("🧹 [AuthContext] Menús y user limpiados tras logout");

    // Redirigir a login
    router.push("/login");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //         USEEFFECT PRINCIPAL PARA INICIALIZAR SESIÓN AL MONTAR
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const pathname = window.location.pathname;
    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/recover");

    // Si es ruta pública, no hacemos refresh
    if (isPublic) {
      console.log("🔓 [AuthContext] Ruta pública => setLoading(false)");
      setLoading(false);
      return;
    }

    // Si cookiesReady === true => llamar initialize
    if (cookiesReady === true) {
      initialize("hook-ready");
    } else if (cookiesReady === false) {
      // Si agotó el tiempo y no detectamos cookies
      console.warn("⚠️ [AuthContext] Cookies no disponibles. Continuando sin sesión.");
      clearUser();
      setLoading(false);

      //Redirección si estamos en ruta protegida
      if (!isPublic) {
        console.warn("🚨 Redirigiendo a /login por falta de tokens");
        router.push("/login");
      }

      // Disparamos session-ready aunque no haya sesión,
      // para que el front no quede colgado esperando
      window.dispatchEvent(new Event("session-ready"));
    }
  }, [cookiesReady, initialize, clearUser]);

  // ─────────────────────────────────────────────────────────────────────────────
  //         USEEFFECT PARA BFCache (VOLVER DESDE BACK/FORWARD CACHE)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handlePageShow = async (event: PageTransitionEvent) => {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const isBfCache = event.persisted || navEntry?.type === "back_forward";

      if (isBfCache) {
        console.log("♻️ [AuthContext] Navegación desde cache detectada => re-init");
        await initialize("pageshow (bfcache)");
        window.dispatchEvent(new Event("session-restored"));
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [initialize]);

  // ─────────────────────────────────────────────────────────────────────────────
  //    USEEFFECT Fallback: si ya hay user y loading terminó,
  //    disparamos session-ready una vez (para no quedar colgado).
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && user) {
      console.log("🔑 [AuthContext] Fallback => ya hay user => session-ready");
      window.dispatchEvent(new Event("session-ready"));
    }
  }, [loading, user]);

  // ─────────────────────────────────────────────────────────────────────────────
  //                          RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// =============================
//  CUSTOM HOOK PARA USAR EL CONTEXTO
// =============================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return context;
};

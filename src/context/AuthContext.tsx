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

// Define el tipo de usuario que estará disponible globalmente en el contexto
export interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
}

// Define qué funciones y datos estarán disponibles desde useAuth()
interface AuthContextType {
  user: User | null;
  loading: boolean;
  handleLogin: (usernameOrEmail: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor que envolverá la app (en layout.tsx)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true); // Controla si la sesión está cargando
  const router = useRouter();

  // Funciones de Zustand para limpiar y manejar menús
  const { clearMenus, setMenuLoaded } = useMenuStore.getState();

  // Hook que espera a que las cookies estén disponibles (refreshToken y csrfToken)
  const cookiesReady = useWaitForCookiesReady(["refreshToken", "csrfToken"], 7000);

  // Zustand para el usuario
  const { user, setUser, clearUser } = useUserStore();

  /**
   * 🔄 Inicializa la sesión restaurando el accessToken mediante el refreshToken.
   * Llamado automáticamente al cargar la app si hay cookies listas.
   */
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
      // Llama al backend para obtener un nuevo accessToken
      const data = await refreshAccessToken();

      // Verifica si las cookies han sido seteadas correctamente
      const accessToken = document.cookie.match(/(^| )accessToken=([^;]+)/)?.[2];
      const refreshToken = document.cookie.match(/(^| )refreshToken=([^;]+)/)?.[2];
      const csrfToken = document.cookie.match(/(^| )csrfToken=([^;]+)/)?.[2];

      console.log("🍪 Tokens tras refresh:");
      console.log("   🔐 accessToken:", accessToken ? "✅" : "❌");
      console.log("   ♻️ refreshToken:", refreshToken ? "✅" : "❌");
      console.log("   🛡️ csrfToken:", csrfToken ? `✅ ${csrfToken}` : "❌");

      // Si el backend devuelve un usuario válido
      if (data?.id) {
        const userData = {
          userId: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        };
        setUser(userData);

        // Da un pequeño tiempo para que cookies estén 100% listas
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
      setLoading(false); // Termina la carga
    }
  }, [setUser, clearUser]);

  /**
   * 🔐 Maneja el login del usuario con credenciales
   */
  const handleLogin = async (usernameOrEmail: string, password: string) => {
    console.log("🕵️ Iniciando login...");

    // 1. Obtener CSRF token antes de hacer login
    await getCsrfToken();

    // 2. Enviar credenciales
    const data = await loginRequest(usernameOrEmail, password);
    console.log("✅ Login exitoso, esperando cookies...");

    // 3. Esperar brevemente a que las cookies sean visibles
    await new Promise((r) => setTimeout(r, 200));

    // 4. Guardar usuario en Zustand
    const userData = {
      userId: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    };
    setUser(userData);

    // 5. Resetear estado de menús y navegación
    localStorage.removeItem("menu-storage");
    clearMenus();
    setMenuLoaded(false);

    // 6. Redirigir al dashboard
    router.push("/dashboard");

    // 7. Emitir evento para cargar menús u otros efectos
    setTimeout(() => {
      console.log("🟢 Emitiendo evento session-ready (post-login)");
      window.dispatchEvent(new Event("session-ready"));
    }, 400);
  };

  /**
   * 🚪 Maneja el logout y limpieza total de sesión
   */
  const handleLogout = async () => {
    await logoutRequest(); // Backend invalida el refreshToken
    setUser(null);
    clearMenus();
    setMenuLoaded(false);

    // Limpiar toda la persistencia local
    localStorage.removeItem("menu-storage");
    localStorage.removeItem("user-storage");
    localStorage.removeItem("panel-storage");
    localStorage.removeItem("sidebar-storage");

    // Redirigir al login
    router.push("/login");
  };

  /**
   * 🧠 Efecto que se ejecuta al montar el provider.
   * Espera a que las cookies estén listas para hacer refresh de sesión.
   */
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
  }, [cookiesReady, initialize]);

  /**
   * 🔁 Maneja navegación con "back-forward cache" (ej. cuando el usuario vuelve atrás con ←)
   */
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

  /**
   * 📦 Retorna el proveedor con acceso global al contexto
   */
  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 🪝 Hook personalizado para acceder al contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return context;
};

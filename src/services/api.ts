import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { waitForAllCookies } from "@/utils/waitForCookie";
import { waitForValidCsrfToken } from "@/utils/waitForCsrfReady";


/**
 * 📦 Utilidad para leer cookies accesibles desde JS
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

// 🚀 Instancia Axios preconfigurada
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Necesario para enviar cookies HttpOnly
});

// ✅ Interceptor de solicitud: agrega CSRF token si está disponible
api.interceptors.request.use((config) => {
  const csrf = getCookie("csrfToken");
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  if (csrf) {
    config.headers["X-CSRF-TOKEN"] = csrf;
    console.log("🛡️ CSRF token agregado al request:", csrf);

    // Detección de CSRF público
    if (csrf.startsWith("ac9dade") || csrf.includes("publico")) {
      console.warn("⚠️ CSRF token aún parece PÚBLICO en ruta:", path);
    }
  } else {
    //amed console.warn("⚠️ No se encontró CSRF token para el request:", path);
  }

  return config;
});

// 🔁 Interceptor de respuesta: intenta refresh si el access token ha expirado (401)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    const isRefresh = originalRequest.url?.includes("/auth/refresh");
    const isLogin = typeof window !== "undefined" && window.location.pathname === "/login";

    if (error.response?.status === 401 && !originalRequest._retry && !isRefresh && !isLogin) {
      originalRequest._retry = true;
      console.warn("⚠️ Token expirado. Intentando refresh...");

      const cookiesOk = await waitForAllCookies(["refreshToken", "csrfToken"], 3000);
      if (!cookiesOk) {
        console.warn("⛔ Cookies insuficientes para intentar refresh.");
        return Promise.reject(error);
      }

      const csrfOk = await waitForValidCsrfToken(3000);
      if (!csrfOk) {
        console.error("❌ CSRF aún inválido. Cancelando refresh.");
        return Promise.reject(error);
      }

      try {
        await api.post("/auth/refresh");
        console.log("✅ Token refrescado. Reintentando solicitud original...");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Falló el refresh. Redirigiendo a login...");
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// =========================
// 🔓 Funciones públicas
// =========================

/**
 * 🎟️ Obtener token CSRF público (antes del login)
 */
export const getCsrfToken = async () => {
  const res = await api.get("/auth/csrf-token");
  return res.data.csrfToken;
};

/**
 * 🔐 Login del usuario
 */
export const login = async (usernameOrEmail: string, password: string) => {
  const res = await api.post("/auth/login", { usernameOrEmail, password });
  return res.data;
};

/**
 * Intenta refrescar el accessToken usando el refreshToken y csrfToken.
 * Asegura que las cookies visibles estén disponibles antes de continuar.
 */
export const refreshAccessToken = async () => {
  // 🔍 Esperamos cookies visibles solamente (csrfToken)
  const cookiesOk = await waitForAllCookies(["csrfToken"], 3000);
  if (!cookiesOk) {
    console.warn("⛔ Cookies visibles necesarias no disponibles. Cancelando refresh.");
    return null;
  }

  // 🛡️ Verificamos que el CSRF ya haya sido rotado (≠ 'publico')
  const csrfOk = await waitForValidCsrfToken(3000);
  if (!csrfOk) {
    console.warn("⛔ CSRF aún es público. Cancelando refresh.");
    return null;
  }

  try {
    const res = await api.post("/auth/refresh");

    const payload = res.data?.user ?? res.data;
    if (!payload?.id) {
      throw new Error("❌ Respuesta inválida: falta user.id");
    }

    console.log("✅ Access token refrescado correctamente.");

    return {
      user: {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        role: payload.role,
      },
      csrfToken: payload.csrfToken, // 👉 disponible si quieres rotarlo manualmente
    };
  } catch (err) {
    console.error("❌ Error al refrescar access token:", err);
    return null;
  }
};



/**
 * 🚪 Logout y cierre de sesión completo
 */
export const logout = async () => {
  await api.post("/auth/logout");
};

export default api;

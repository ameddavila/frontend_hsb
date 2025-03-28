import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { waitForAllCookies } from "@/utils/waitForCookie";

// 📦 Obtener cookie del navegador
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

// 🚀 Axios configurado
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// ✅ Interceptor de solicitud: Agrega CSRF token a headers
api.interceptors.request.use((config) => {
  const csrf = getCookie("csrfToken");
  if (csrf) {
    config.headers["X-CSRF-TOKEN"] = csrf;
    console.log("🛡️ CSRF token agregado al request:", csrf);
  } else {
    console.warn("⚠️ No se encontró CSRF token para el request");
  }
  return config;
});

// 🔄 Interceptor de respuesta: Intenta refresh si hay 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    const isRefresh = originalRequest.url?.includes("/auth/refresh");
    const isLogin = typeof window !== "undefined" && window.location.pathname === "/login";

    if (error.response?.status === 401 && !originalRequest._retry && !isRefresh && !isLogin) {
      originalRequest._retry = true;

      const ready = await waitForAllCookies(["refreshToken", "csrfToken"], 2000);
      if (!ready) {
        console.warn("⛔ Cookies insuficientes para intentar refresh.");
        return Promise.reject(error);
      }

      try {
        console.log("🔁 Intentando refrescar access token desde interceptor...");
        await api.post("/auth/refresh");
        return api(originalRequest); // Reintentar el request original
      } catch (err) {
        console.error("❌ Falló el refresh, redirigiendo a login.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// =======================
// Exportación de funciones
// =======================

export const getCsrfToken = async () => {
  const res = await api.get("/auth/csrf-token");
  return res.data.csrfToken;
};

export const login = async (usernameOrEmail: string, password: string) => {
  const res = await api.post("/auth/login", { usernameOrEmail, password });
  return res.data;
};

export const refreshAccessToken = async () => {
  const ready = await waitForAllCookies(["refreshToken", "csrfToken"], 3000);
  if (!ready) {
    console.warn("⛔ Cookies necesarias no disponibles. Cancelando refresh.");
    return null;
  }

  try {
    const res = await api.post("/auth/refresh");
    if (!res.data?.user) throw new Error("Respuesta sin usuario");
    console.log("✅ Access token refrescado correctamente.");
    return res.data;
  } catch (err) {
    console.error("❌ Error al refrescar access token:", err);
    return null;
  }
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export default api;

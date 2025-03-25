import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { InternalAxiosRequestConfig } from "axios";

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

async function waitForCsrfToken(maxWaitMs = 1000): Promise<string | null> {
  const interval = 50;
  let waited = 0;
  while (waited < maxWaitMs) {
    const token = getCookieValue("csrfToken");
    if (token) return token;
    await new Promise((r) => setTimeout(r, interval));
    waited += interval;
  }
  return null;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  let csrfToken = getCookieValue("csrfToken");

  if (!csrfToken) {
     console.warn("⚠️ CSRF token no encontrado. Esperando...");
    csrfToken = await waitForCsrfToken();
  }

  if (csrfToken) {
    config.headers["X-CSRF-TOKEN"] = csrfToken;
    //console.log("📦 CSRF token agregado:", csrfToken);
  } else {
    console.error("❌ CSRF token no disponible después de esperar");
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    const refreshToken = getCookieValue("refreshToken");
    const isGuestRoute = typeof window !== "undefined" && window.location.pathname === "/login";
    const isRefreshRequest =  originalRequest.url && originalRequest.url.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      refreshToken &&
      !isGuestRoute
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const getCsrfToken = async (): Promise<string> => {
  const res = await api.get("/auth/csrf-token");
  //console.log("✅ CSRF recibido desde backend:", res.data.csrfToken);
  return res.data.csrfToken;
};

export const login = async (usernameOrEmail: string, password: string) => {
  const res = await api.post("/auth/login", { usernameOrEmail, password });
  return res.data;
};

export const refreshAccessToken = async () => {
  const refreshToken = getCookieValue("refreshToken");
  const csrfToken = getCookieValue("csrfToken");

  if (!refreshToken || !csrfToken) {
    console.warn("⛔ refreshToken o csrfToken faltan");
    return null; // No lanzar error
  }

  try {
    const res = await api.post("/auth/refresh");
    if (!res.data?.user) {
      throw new Error("Respuesta sin usuario");
    }
    console.log("🔄 Access token refrescado correctamente");
    return res.data;
  } catch (err) {
    console.error("❌ Error al refrescar access token:", err);
    throw err;
  }
};



export const logout = async () => {
  await api.post("/auth/logout");
};

export default api;

import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 🔹 Necesario para enviar cookies
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }

  return config;
});

// 🔹 Reintentar solicitud si el token ha expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("🔴 Token expirado. Intentando refrescar...");

      const newSession = await getSession();

      if (newSession?.user?.accessToken) {
        originalRequest.headers.Authorization = `Bearer ${newSession.user.accessToken}`;
        return api(originalRequest);
      } else {
        console.warn("❌ RefreshToken también expiró. Cerrando sesión...");
        signOut();
      }
    }

    return Promise.reject(error);
  }
);

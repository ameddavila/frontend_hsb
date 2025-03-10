import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Interceptor para añadir el token CSRF automáticamente
api.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split(";")
    .find((cookie) => cookie.includes("csrfToken"))
    ?.split("=")[1];
  if (csrfToken) {
    config.headers["X-CSRF-TOKEN"] = csrfToken;
  }
  return config;
});

// Interceptor para manejar expiración de tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await api.post("/auth/refresh");
        return api.request(error.config);
      } catch {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

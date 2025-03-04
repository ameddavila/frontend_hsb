import { useState } from "react";
import { api } from "../services/api";

export const useAuth = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        usernameOrEmail,
        password,
      });

      setCsrfToken(response.data.csrfToken);
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  return { login, csrfToken };
};

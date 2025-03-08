import { useState, useEffect } from "react";
import { login, logout, refreshAccessToken } from "@/services/api";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await refreshAccessToken();
        if (token) {
          setUser(token.user);
        }
      } catch {
        // No se define ninguna variable, evitando el warning de ESLint
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await login(usernameOrEmail, password);
      if (!response.success) {
        if (response.status === 403) {
          router.push("/activar-cuenta");
        }
        throw new Error(response.message);
      }
      setUser(response);
    } catch (error) {
      console.error("Error en login:", error); // ✅ Se usa la variable para evitar warning
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, handleLogin, handleLogout };
};

import { useState, useEffect } from "react";
import { login, logout, refreshAccessToken } from "@/services/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await refreshAccessToken();
        if (token) {
          setUser(token.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async (usernameOrEmail: string, password: string) => {
    try {
      const userData = await login(usernameOrEmail, password);
      setUser(userData);
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, handleLogin, handleLogout };
};

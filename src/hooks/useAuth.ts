"use client";

import { useState, useEffect } from "react";
import { login, logout, refreshAccessToken, getCsrfToken } from "@/services/api";
import { useRouter } from "next/navigation";

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

async function waitForNewCsrfToken(oldToken: string, maxWaitMs = 1000): Promise<string | null> {
  const interval = 50;
  let waited = 0;
  while (waited < maxWaitMs) {
    const current = getCookieValue("csrfToken");
    if (current && current !== oldToken) return current;
    await new Promise((r) => setTimeout(r, interval));
    waited += interval;
  }
  return null;
}

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      console.log("⏳ Intentando refrescar token...");
      try {
        const token = await refreshAccessToken();
        console.log("✅ Token refrescado:", token);
        if (token?.user) setUser(token.user);
      } catch (e) {
        console.log("⚠️ Error al refrescar token:", e);
        setUser(null);
      } finally {
        setLoading(false);
        console.log("✅ Finalizado loading");
      }
    };
  
    fetchUser();
  }, []);
  

  const handleLogin = async (usernameOrEmail: string, password: string) => {
    try {
      const oldToken = getCookieValue("csrfToken");
      console.log("🕵️ CSRF antes de login (modo público):", oldToken);

      await getCsrfToken(); // token público, solo por si falta

      console.log("🚀 Enviando credenciales...");
      const response = await login(usernameOrEmail, password);
      setUser(response);

      // Esperar que backend setee cookies
      await new Promise((r) => setTimeout(r, 200));

      // Esperar y confirmar el nuevo CSRF token con userId
      const newCsrf = await waitForNewCsrfToken(oldToken || "");
      console.log("🔐 CSRF después de login (modo user):", newCsrf);

      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Error en login:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return { user, loading, handleLogin, handleLogout };
};

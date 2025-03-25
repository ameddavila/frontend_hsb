"use client";

import { useEffect } from "react";
import { getCsrfToken } from "@/services/api";

/**
 * Hook para cargar el CSRF token al montar componentes públicos como /login, /register, etc.
 * Solo lo solicita si no hay uno existente.
 */
export const useCsrf = () => {
  useEffect(() => {
    const existingToken = document.cookie.match(/(^| )csrfToken=([^;]+)/)?.[2];

    if (existingToken) {
      console.log("🟢 Ya existe un CSRF token:", existingToken);
      return; // ✅ No solicitar si ya hay uno
    }

    const fetchCsrf = async () => {
      try {
        const token = await getCsrfToken();
        console.log("✅ CSRF cargado desde useCsrf:", token);
      } catch (err) {
        console.error("❌ Error al obtener CSRF desde useCsrf:", err);
      }
    };

    fetchCsrf();
  }, []);
};

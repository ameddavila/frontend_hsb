"use client"; // Agrega esta línea si usas Next.js 13+ con App Router

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation"; // 🔹 Cambiar 'next/router' por 'next/navigation'
import { useEffect } from "react";

export const withAuth = (WrappedComponent: React.FC, requiredRole: string) => {
  const AuthComponent = (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || user.role !== requiredRole)) {
        router.push("/login");
      }
    }, [user, loading, router]);

    if (loading) {
      return <p>Cargando...</p>;
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthComponent;
};
export default withAuth; // 🔹 Agregar la exportación por defecto

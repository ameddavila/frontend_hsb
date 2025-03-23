"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      console.warn("⛔️ Usuario no autenticado. Redirigiendo a login...");
      router.push("/login");
    }
  }, [status]);

  if (status === "loading") return <p>Cargando sesión...</p>;
  if (status === "unauthenticated") return null;

  return (
    <div>
      <h1 className="mb-4">Bienvenido al Dashboard</h1>
      <p>Aquí colocas el contenido principal del módulo de inicio.</p>
    </div>
  );
}

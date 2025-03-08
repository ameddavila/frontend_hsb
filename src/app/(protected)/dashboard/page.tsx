"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <ProgressSpinner />
        <p className="ml-4 text-blue-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold">
        Bienvenido,{" "}
        {session?.user?.roleName || session?.user?.role || "Usuario"}!
      </h1>

      <p className="mt-2 text-color-secondary">Este es tu panel de control.</p>
    </div>
  );
}

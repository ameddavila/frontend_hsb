"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ActivarCuenta = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/contacto-soporte"); // 🔹 Redirigir a contacto o soporte
    }, 5000);
  }, [router]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Tu cuenta está inactiva</h1>
      <p>Por favor, contacta a un administrador para activarla.</p>
      <p>Serás redirigido en unos segundos...</p>
    </div>
  );
};

export default ActivarCuenta;

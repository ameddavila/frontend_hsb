"use client";
import { SessionProvider } from "next-auth/react";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Importa el tema
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css"; // PrimeFlex
import "@/styles/auth.css"; // Asegura que los estilos sean globales
import "@/styles/globals.css"; // Si tienes otro archivo global

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="es">
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}

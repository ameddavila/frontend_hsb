"use client";

import { AuthProvider } from "../context/AuthContext";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "@/styles/auth.css";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="es">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}

"use client";

import { AuthProvider } from "../context/AuthContext";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "@/styles/auth.css";
import "@/styles/globals.css";
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Toaster richColors position="top-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

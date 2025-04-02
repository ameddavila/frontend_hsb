// app/(public)/layout.tsx
"use client";

import React from "react";
import "@/styles/globals.css"; // Estilos globales para toda la app
import "@/styles/auth.css";    // Estilos específicos de login/registro/etc.

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="public-layout">
      {/* Aquí puedes agregar un logo o encabezado en el futuro */}
      {children}
    </main>
  );
}

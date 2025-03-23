// app/(public)/layout.tsx
"use client";
import React from "react";
import "@/styles/globals.css"; // Asegura que los estilos globales se apliquen
import "@/styles/auth.css"; // Asegura los estilos de autenticación

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}

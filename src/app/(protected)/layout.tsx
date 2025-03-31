// src/app/(protected)/layout.tsx
"use client";
import React from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("[ProtectedLayout] (app/(protected)/layout.tsx) se renderiza");

  // Simplemente encapsulamos el contenido con nuestro ProtectedLayout de la carpeta components
  return <ProtectedLayout>{children}</ProtectedLayout>;
}

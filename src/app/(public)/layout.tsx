// app/(public)/layout.tsx
"use client";

import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="public-layout">
      {/* Aquí puedes agregar un logo o encabezado en el futuro */}
      {children}
    </main>
  );
}

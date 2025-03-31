// src/app/(protected)/layout.tsx
"use client";
import React from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout"; // ✅ IMPORT CORRECTO

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}

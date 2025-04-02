// src/app/(protected)/admin/layout.tsx
"use client";

import React from "react";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "@/styles/admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
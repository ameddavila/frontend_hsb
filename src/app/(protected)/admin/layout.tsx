// src/app/(protected)/admin/layout.tsx
"use client";

import React from "react";
import "@/styles/layout.css";
import "@/styles/admin.css";
import "@/styles/globals.css";



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


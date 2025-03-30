// src/app/(protected)/admin/page.tsx
"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

export default function AdminHome() {
  return (
    <div className="dashboard-container surface-ground p-4">
      <div className="text-2xl font-bold text-color mb-2">👋 Bienvenido, Administrador</div>
      <div className="text-color-secondary mb-4">
        Aquí puedes gestionar el sistema y acceder a funciones administrativas.
      </div>

      <Divider className="my-3" />

      <div className="grid">
        {/* ... tus cards aquí ... */}
      </div>
    </div>
  );
}

// src/app/(protected)/dashboard/page.tsx
"use client";

import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

export default function Dashboard() {
  // 🧪 Datos simulados (reemplazar luego por datos reales vía API)
  const stats = {
    usuarios: 124,
    roles: 6,
    permisos: 48,
    menus: 12,
  };

  return (
    <div className="dashboard-container surface-ground p-4">
      <div className="text-2xl font-bold text-color mb-3">📊 Resumen General</div>
      <div className="text-color-secondary mb-4">
        Estas son las estadísticas actuales del sistema.
      </div>

      <Divider className="my-3" />

      <div className="grid dashboard-grid">
        <div className="col-12 sm:col-6 lg:col-3">
          <Card className="dashboard-card">
            <div className="text-xl font-semibold text-blue-600 mb-2">Usuarios</div>
            <div className="text-3xl font-bold">{stats.usuarios}</div>
            <div className="text-sm text-color-secondary mt-2">Usuarios registrados</div>
          </Card>
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          <Card className="dashboard-card">
            <div className="text-xl font-semibold text-purple-600 mb-2">Roles</div>
            <div className="text-3xl font-bold">{stats.roles}</div>
            <div className="text-sm text-color-secondary mt-2">Roles definidos</div>
          </Card>
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          <Card className="dashboard-card">
            <div className="text-xl font-semibold text-green-600 mb-2">Permisos</div>
            <div className="text-3xl font-bold">{stats.permisos}</div>
            <div className="text-sm text-color-secondary mt-2">Permisos configurados</div>
          </Card>
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          <Card className="dashboard-card">
            <div className="text-xl font-semibold text-orange-600 mb-2">Menús</div>
            <div className="text-3xl font-bold">{stats.menus}</div>
            <div className="text-sm text-color-secondary mt-2">Menús en uso</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

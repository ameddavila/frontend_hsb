// ✅ PanelDerecho con PrimeReact + PrimeFlex, listo para producción
"use client";

import React from "react";
import { Card } from "primereact/card";

export default function PanelDerecho() {
  return (
    <aside
      className="panel-derecho surface-card p-3 flex flex-column gap-3"
      style={{ width: "20rem", minWidth: "20rem" }}
    >
      <h3 className="text-xl mb-2 text-color">Últimas Transacciones</h3>

      <Card title="Pago a Proveedor 1" subTitle="Bs. 200" />
      <Card title="Pago a Proveedor 2" subTitle="Bs. 350" />
      <Card title="Transferencia a Cliente" subTitle="Bs. 100" />
    </aside>
  );
}
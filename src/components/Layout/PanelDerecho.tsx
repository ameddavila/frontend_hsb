"use client";

import React from "react";
import { Card } from "primereact/card";

export default function PanelDerecho() {
  return (
    <aside
      className="bg-white border-left-1 surface-border p-3"
      style={{ width: "20rem", minWidth: "20rem" }}
    >
      <h3 className="text-xl mb-3">Últimas Transacciones</h3>
      <div className="flex flex-column gap-2">
        <Card title="Pago a Proveedor 1" subTitle="Bs. 200" />
        <Card title="Pago a Proveedor 2" subTitle="Bs. 350" />
        <Card title="Transferencia a Cliente" subTitle="Bs. 100" />
      </div>
    </aside>
  );
}

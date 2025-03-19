// components/Layout/PanelDerecho.tsx
"use client";

import "@/styles/panel.css";

export default function PanelDerecho() {
  return (
    <aside className="panel-derecho">
      <h3>Últimas Transacciones</h3>
      <ul>
        <li>Pago a Proveedor 1 - Bs. 200</li>
        <li>Pago a Proveedor 2 - Bs. 350</li>
        <li>Transferencia a Cliente - Bs. 100</li>
      </ul>
    </aside>
  );
}

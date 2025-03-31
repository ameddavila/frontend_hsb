// src/components/menus/IconSelectorModal.tsx
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState } from "react";
import "primeicons/primeicons.css";
import "@/styles/icon-selector.css"; // Importa el CSS personalizado

const allIcons = [
  "pi pi-home", "pi pi-user", "pi pi-cog", "pi pi-lock", "pi pi-book", "pi pi-chart-bar",
  "pi pi-envelope", "pi pi-shopping-cart", "pi pi-users", "pi pi-list", "pi pi-calendar",
  "pi pi-globe", "pi pi-star", "pi pi-file", "pi pi-folder", "pi pi-image",
  // ... puedes añadir más de https://primefaces.org/primeicons
];

export function IconSelectorModal({
  visible,
  onHide,
  onSelect,
}: {
  visible: boolean;
  onHide: () => void;
  onSelect: (icon: string) => void;
}) {
  const [filter, setFilter] = useState("");

  const filteredIcons = allIcons.filter((icon) =>
    icon.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Dialog header="Seleccionar Ícono" visible={visible} onHide={onHide} style={{ width: "50vw" }}>
      <div className="p-inputgroup mb-3">
        <InputText
          placeholder="Buscar ícono..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="icon-grid">
        {filteredIcons.map((icon) => (
          <Button
            key={icon}
            icon={icon}
            className="p-button-rounded p-button-text"
            tooltip={icon}
            onClick={() => onSelect(icon)}
          />
        ))}
      </div>
    </Dialog>
  );
}

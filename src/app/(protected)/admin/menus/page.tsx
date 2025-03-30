"use client";

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { getMenus, deleteMenu } from "@/services/menuService";
import { Menu } from "@/types/Menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import "@/styles/dashboard.css";
import "@/styles/admin.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filtered, setFiltered] = useState<Menu[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    cargarMenus();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    setFiltered(
      menus.filter(
        (menu) =>
          menu.name.toLowerCase().includes(query) ||
          menu.path?.toLowerCase().includes(query) ||
          menu.icon?.toLowerCase().includes(query)
      )
    );
  }, [search, menus]);

  const cargarMenus = async () => {
    try {
      const data = await getMenus();
      setMenus(data);
    } catch {
      toast.error("Error al cargar menús");
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await deleteMenu(id);
      toast.success("Menú eliminado correctamente");
      cargarMenus();
    } catch {
      toast.error("Error al eliminar menú");
    }
  };

  const confirmarEliminacion = (menu: Menu) => {
    confirmDialog({
      message: `¿Seguro que deseas eliminar el menú "${menu.name}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      acceptClassName: "p-button-danger",
      accept: () => handleEliminar(menu.id),
    });
  };

  const accionesTemplate = (rowData: Menu) => (
    <div className="flex gap-2 justify-center">
      <Button
        icon="pi pi-pencil"
        severity="info"
        size="small"
        onClick={() => router.push(`/admin/menus/${rowData.id}/edit`)}
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        size="small"
        onClick={() => confirmarEliminacion(rowData)}
      />
    </div>
  );

  return (
    <div className="admin-page p-4">
      <ConfirmDialog />

      <div className="flex flex-column md:flex-row justify-between align-items-center mb-4 gap-3">
        <div className="text-2xl font-bold text-color">📋 Gestión de Menús</div>
        <Button
          label="Crear Menú"
          icon="pi pi-plus"
          onClick={() => router.push("/admin/menus/create")}
          className="p-button-sm"
        />
      </div>

      <div className="mb-3">
        <InputText
          placeholder="🔍 Buscar menú por nombre, ruta o ícono"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-30rem"
        />
      </div>

      <DataTable
        value={filtered}
        stripedRows
        responsiveLayout="scroll"
        size="small"
        className="shadow-2 border-round"
        emptyMessage="No hay menús disponibles"
      >
        <Column field="id" header="ID" style={{ width: "60px" }} />
        <Column field="name" header="Nombre" />
        <Column field="path" header="Ruta" />
        <Column field="icon" header="Ícono" />
        <Column field="parentId" header="Padre" />
        <Column
          body={accionesTemplate}
          header="Acciones"
          style={{ textAlign: "center", width: "160px" }}
        />
      </DataTable>
    </div>
  );
}

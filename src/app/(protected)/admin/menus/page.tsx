"use client";

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { createMenu, deleteMenu, getMenus } from "@/services/menuService";
import { Menu } from "@/types/Menu";
import { toast } from "sonner";
import "@/styles/dashboard.css"; // Tu CSS global
import "@/styles/admin.css"; // Asegúrate de importar tu global

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [nombre, setNombre] = useState("");
  const [ruta, setRuta] = useState("");
  const [icono, setIcono] = useState("");
  const [padreId, setPadreId] = useState("");

  useEffect(() => {
    cargarMenus();
  }, []);

  const cargarMenus = async () => {
    try {
      const data = await getMenus();
      setMenus(data);
    } catch (error) {
      toast.error("Error al cargar menús");
    }
  };

  const handleCrear = async () => {
    try {
      await createMenu({ nombre, ruta, icono, padreId: padreId ? Number(padreId) : null });
      toast.success("Menú creado correctamente");
      setNombre("");
      setRuta("");
      setIcono("");
      setPadreId("");
      cargarMenus();
    } catch (error) {
      toast.error("Error al crear menú");
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await deleteMenu(id);
      toast.success("Menú eliminado");
      cargarMenus();
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const accionesTemplate = (rowData: Menu) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" severity="info" size="small" />
      <Button icon="pi pi-trash" severity="danger" size="small" onClick={() => handleEliminar(rowData.id)} />
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex flex-column md:flex-row gap-3 mb-4">
        <InputText placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full md:w-2" size="small" />
        <InputText placeholder="Ruta" value={ruta} onChange={(e) => setRuta(e.target.value)} className="w-full md:w-2" size="small" />
        <InputText placeholder="Ícono" value={icono} onChange={(e) => setIcono(e.target.value)} className="w-full md:w-2" size="small" />
        <InputText placeholder="ID del Padre" value={padreId} onChange={(e) => setPadreId(e.target.value)} className="w-full md:w-2" size="small" />
        <Button label="Crear Menú" icon="pi pi-plus" onClick={handleCrear} size="small" />
      </div>

      <DataTable value={menus} stripedRows responsiveLayout="scroll" size="small" className="shadow-2 border-round">
        <Column field="id" header="ID" style={{ width: "60px" }} />
        <Column field="nombre" header="Nombre" />
        <Column field="ruta" header="Ruta" />
        <Column field="icono" header="Ícono" />
        <Column field="padreId" header="Padre" />
        <Column body={accionesTemplate} header="Acciones" style={{ textAlign: "center", width: "160px" }} />
      </DataTable>
    </div>
  );
}

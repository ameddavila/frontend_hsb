"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAllConnections } from "@/services/dbConnectionService";
import { DbConnection } from "@/types/DbConnection";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useConfigActions } from "@/hooks/useConfigActions"; // 👈 tu nuevo hook

export default function ListarConfigPage() {
  const [conexiones, setConexiones] = useState<DbConnection[]>([]);
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const {
    handleDeleteConfig,
    handleInitializeConfig
  } = useConfigActions({ onFinish: () => cargarConexiones() });

  const cargarConexiones = async () => {
    try {
      const res = await getAllConnections();
      setConexiones(res);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las conexiones",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    cargarConexiones();
  }, []);

  const confirmarEliminacion = (id: number) => {
    confirmDialog({
      message: "¿Estás seguro de eliminar esta conexión?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: () => handleDeleteConfig(id),
    });
  };

  const confirmarInicializacion = (id: number) => {
    confirmDialog({
      message: "Esto inicializará la base remota. ¿Deseas continuar?",
      header: "Inicializar Base de Datos",
      icon: "pi pi-database",
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: () => handleInitializeConfig(id),
    });
  };

  return (
    <div className="card p-4">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Conexiones Remotas</h2>
        <Button
          label="Nueva Conexión"
          icon="pi pi-plus"
          onClick={() => router.push("/admin/configbd/create")}
        />
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Nombre</th>
            <th className="border p-2 text-left">Servidor</th>
            <th className="border p-2 text-left">Base de Datos</th>
            <th className="border p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {conexiones.map((conn) => (
            <tr key={conn.id}>
              <td className="border p-2">{conn.nombre}</td>
              <td className="border p-2">{conn.servidor}</td>
              <td className="border p-2">{conn.baseDatos}</td>
              <td className="border p-2 text-center">
                <div className="flex justify-center gap-2">
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-sm p-button-outlined"
                    onClick={() => router.push(`/admin/configbd/${conn.id}/edit`)}
                    tooltip="Editar"
                  />
                  <Button
                    icon="pi pi-trash"
                    className="p-button-sm p-button-danger p-button-outlined"
                    onClick={() => confirmarEliminacion(conn.id)}
                    tooltip="Eliminar"
                  />
                  <Button
                    icon="pi pi-database"
                    className="p-button-sm p-button-success p-button-outlined"
                    onClick={() => confirmarInicializacion(conn.id)}
                    tooltip="Inicializar"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

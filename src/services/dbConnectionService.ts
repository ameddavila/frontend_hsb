import api from "./api";
import { DbConnection, DbConnectionInput } from "@/types/DbConnection"; // Tipo centralizado

// 🔍 Obtener todas las conexiones
export const getAllConnections = async (): Promise<DbConnection[]> => {
  const res = await api.get<{ data: DbConnection[] }>("/config");
  return res.data.data;
};

// 🔍 Obtener una conexión por ID
export const getConnectionById = async (id: number): Promise<DbConnection> => {
  const res = await api.get<{ data: DbConnection }>(`/config/${id}`);
  return res.data.data;
};

// ➕ Crear nueva conexión
export const createConnection = async (
  data: DbConnectionInput
): Promise<DbConnection> => {
  const res = await api.post<{ data: DbConnection }>("/config", data);
  return res.data.data;
};

// ✏️ Actualizar conexión por ID
export const updateConnection = async (
  id: number,
  data: DbConnectionInput
): Promise<DbConnection> => {
  const res = await api.put<{ data: DbConnection }>(`/config/${id}`, data);
  return res.data.data;
};

// 🗑️ Eliminar conexión por ID
export const deleteConnection = async (
  id: number
): Promise<{ mensaje: string }> => {
  const res = await api.delete<{ mensaje: string }>(`/config/${id}`);
  return res.data;
};

// 🧠 Inicializar base remota por ID
export const initializeDbConnection = async (
  id: number
): Promise<{ mensaje: string }> => {
  const res = await api.post<{ mensaje: string }>(`/config/initialize/${id}`);
  return res.data;
};

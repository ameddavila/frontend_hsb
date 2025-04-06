// src/hooks/useConfigActions.ts
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteConnection,
  initializeDbConnection,
  createConnection,
  updateConnection,
} from "@/services/dbConnectionService";
import { DbConnectionInput } from "@/types/DbConnection";

interface UseConfigActionsProps {
  onFinish?: () => void;
}

export const useConfigActions = ({ onFinish }: UseConfigActionsProps = {}) => {
  const router = useRouter();

  const handleCreateConfig = async (data: DbConnectionInput) => {
    try {
      await createConnection(data);
      toast.success("✅ Conexión creada correctamente");
      router.push("/admin/configbd");
      onFinish?.();
    } catch {
      toast.error("❌ Error al crear la conexión");
    }
  };

  const handleUpdateConfig = async (id: number, data: DbConnectionInput) => {
    try {
      await updateConnection(id, data);
      toast.success("✅ Conexión actualizada correctamente");
      router.push("/admin/configbd");
      onFinish?.();
    } catch {
      toast.error("❌ Error al actualizar la conexión");
    }
  };

  const handleDeleteConfig = async (id: number) => {
    try {
      await deleteConnection(id);
      toast.success("✅ Conexión eliminada correctamente");
      onFinish?.();
    } catch {
      toast.error("❌ Error al eliminar la conexión");
    }
  };

  const handleInitializeConfig = async (id: number) => {
    try {
      const res = await initializeDbConnection(id);
      toast.success(res.mensaje);
      onFinish?.();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } } };
      toast.error(error.response?.data?.mensaje || "Error al inicializar la base");
    }
  };

  return {
    handleCreateConfig,
    handleUpdateConfig,
    handleDeleteConfig,
    handleInitializeConfig,
  };
};

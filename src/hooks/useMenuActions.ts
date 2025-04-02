import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createMenu, deleteMenu, updateMenu, MenuInput } from "@/services/menuService";
import { useMenuStore } from "@/stores/menuStore";

export const useMenuActions = () => {
  const router = useRouter();
  const { loadMenus } = useMenuStore();

  const refreshMenus = async () => {
    try {
      await loadMenus();
    } catch {
      toast.error("❌ Error al recargar menús");
    }
  };

  const handleCreateMenu = async (data: MenuInput) => {
    try {
      await createMenu({
        ...data,
        parentId: data.parentId ? Number(data.parentId) : null,
      });
      toast.success("✅ Menú creado correctamente");
      await refreshMenus();
      router.push("/admin/menus");
    } catch {
      toast.error("❌ Error al crear el menú");
    }
  };

  const handleUpdateMenu = async (id: number, data: MenuInput) => {
    try {
      await updateMenu(id, {
        ...data,
        parentId: data.parentId ? Number(data.parentId) : null,
      });
      toast.success("✅ Menú actualizado correctamente");
      await refreshMenus();
      router.push("/admin/menus");
    } catch {
      toast.error("❌ Error al actualizar el menú");
    }
  };

  const handleDeleteMenu = async (id: number) => {
    try {
      await deleteMenu(id);
      toast.success("✅ Menú eliminado correctamente");
      await refreshMenus();
    } catch {
      toast.error("❌ Error al eliminar el menú");
    }
  };

  return { handleCreateMenu, handleUpdateMenu, handleDeleteMenu };
};

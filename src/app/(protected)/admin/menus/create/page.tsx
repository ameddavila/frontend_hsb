"use client";

import { useRouter } from "next/navigation";
import { createMenu, MenuInput } from "@/services/menuService";
import MenuForm from "@/components/menus/MenuForm";
import { toast } from "sonner";
import { useMenuStore } from "@/stores/menuStore"; // 🧠 importante

export default function CreateMenuPage() {
  const router = useRouter();
  const loadMenus = useMenuStore((state) => state.loadMenus); // ✅ hook de carga

  const handleCreate = async (data: MenuInput) => {
    try {
      await createMenu({
        ...data,
        parentId: data.parentId ? Number(data.parentId) : null,
      });

      toast.success("✅ Menú creado correctamente");

      // 🆕 Recargar menús desde el backend
      await loadMenus();

      router.push("/admin/menus");
    } catch {
      toast.error("❌ Error al crear el menú");
    }
  };

  return (
    <div className="admin-page p-4 max-w-xl mx-auto">
      <div className="text-xl font-bold mb-4">🆕 Crear Nuevo Menú</div>
      <MenuForm onSubmit={handleCreate} />
    </div>
  );
}

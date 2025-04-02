"use client";

import { useRouter } from "next/navigation";
import { createMenu, MenuInput } from "@/services/menuService";
import MenuForm from "@/components/menus/MenuForm";
import { toast } from "sonner";
import { useMenuStore } from "@/stores/menuStore";
import { Card } from "primereact/card";
import FormContainer from "@/components/ui/FormContainer"

export default function CreateMenuPage() {
  const router = useRouter();
  const loadMenus = useMenuStore((state) => state.loadMenus);

  const handleCreate = async (data: MenuInput) => {
    try {
      await createMenu({
        ...data,
        parentId: data.parentId ? Number(data.parentId) : null,
      });

      toast.success("✅ Menú creado correctamente");

      await loadMenus();
      router.push("/admin/menus");
    } catch {
      toast.error("❌ Error al crear el menú");
    }
  };

  return (
    <div className="p-4">
      <div className="p-grid p-justify-center">
        <div className="p-col-12 md:p-col-10 lg:p-col-6">
          <Card>
          <FormContainer title="🆕 Crear Nuevo Menú">
              <MenuForm onSubmit={handleCreate} />
          </FormContainer>

          </Card>
        </div>
      </div>
    </div>
  );
}

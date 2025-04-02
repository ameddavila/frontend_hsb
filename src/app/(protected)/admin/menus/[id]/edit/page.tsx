"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getMenuById, updateMenu, MenuInput } from "@/services/menuService";
import { useRouter, useParams } from "next/navigation";
import MenuForm from "@/components/menus/MenuForm";
import { toast } from "sonner";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

export default function EditMenuPage() {
  const router = useRouter();
  const params = useParams();
  const form = useForm<MenuInput>();

  useEffect(() => {
    const fetchData = async () => {
      const menuId = Number(params.id);
      if (!menuId || isNaN(menuId)) {
        toast.error("ID inválido");
        return;
      }

      try {
        const res = await getMenuById(menuId);
        form.reset(res);
      } catch {
        toast.error("Error al cargar el menú");
      }
    };

    fetchData();
  }, [params.id, form]);

  const onSubmit = async (data: MenuInput) => {
    try {
      await updateMenu(Number(params.id), {
        ...data,
        parentId: data.parentId ? Number(data.parentId) : null,
      });
      toast.success("Menú actualizado");
      router.push("/admin/menus");
    } catch {
      toast.error("Error al actualizar el menú");
    }
  };

  return (
    <div className="p-4">
      <div className="p-grid p-justify-center">
        <div className="p-col-12 md:p-col-10 lg:p-col-6">
          <Card>
            <h2 className="text-xl font-bold mb-2">✏️ Editar Menú</h2>
            <Divider className="my-2" />
            <MenuForm onSubmit={onSubmit} form={form} />
          </Card>
        </div>
      </div>
    </div>
  );
}

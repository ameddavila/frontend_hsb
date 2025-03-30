"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getMenuById, updateMenu, MenuInput } from "@/services/menuService";
import { useRouter, useParams } from "next/navigation";
import MenuForm from "@/components/menus/MenuForm";
import { toast } from "sonner";

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
        form.reset(res); // res ya es tipo MenuInput o compatible
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
    <div className="admin-page p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">✏️ Editar Menú</h1>
      <MenuForm onSubmit={onSubmit} form={form} />
    </div>
  );
}

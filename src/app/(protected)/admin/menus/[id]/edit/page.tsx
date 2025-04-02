"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getMenuById, MenuInput } from "@/services/menuService";
import MenuForm from "@/components/menus/MenuForm";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useMenuActions } from "@/hooks/useMenuActions";

export default function EditMenuPage() {
  const params = useParams();
  const form = useForm<MenuInput>();
  const { handleUpdateMenu } = useMenuActions();

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

  const onSubmit = (data: MenuInput) => {
    handleUpdateMenu(Number(params.id), data);
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

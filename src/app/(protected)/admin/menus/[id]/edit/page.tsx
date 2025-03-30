// ✏️ src/app/(protected)/admin/menus/[id]/edit/page.tsx
"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getMenuById, updateMenu } from "@/services/menuService";
import { useRouter, useParams } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { toast } from "sonner";

const EditMenuPage = () => {
  const router = useRouter();
  const params = useParams();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getMenuById(Number(params.id));
        reset(res.data);
      } catch (error) {
        toast.error("Error al cargar menú");
      }
    };

    fetchMenu();
  }, [params.id, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateMenu(Number(params.id), data);
      toast.success("Menú actualizado");
      router.push("/admin/menus");
    } catch (error) {
      toast.error("Error al actualizar menú");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Editar Menú</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputText placeholder="Nombre" {...register("name", { required: true })} />
        <InputText placeholder="Ruta" {...register("path")} />
        <InputText placeholder="Ícono" {...register("icon")} />
        <InputText placeholder="ID del Padre" type="number" {...register("parentId")} />

        <Button label="Actualizar" icon="pi pi-save" type="submit" />
      </form>
    </div>
  );
};

export default EditMenuPage;
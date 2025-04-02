// src/components/menus/EditarMenuDialog.tsx
"use client";

import { Dialog } from "primereact/dialog";
import { updateMenu } from "@/services/menuService";
import { Menu, MenuInput } from "@/types/Menu";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { toast } from "sonner";
import { useEffect } from "react";
import { useMenuStore } from "@/stores/menuStore";

interface EditarMenuDialogProps {
  visible: boolean;
  onHide: () => void;
  menu: Menu;
}

export default function EditarMenuDialog({ visible, onHide, menu }: EditarMenuDialogProps) {
  const { register, handleSubmit, reset, control } = useForm<MenuInput>();

  useEffect(() => {
    if (menu) {
      // Normalizamos datos
      reset({
        name: menu.name,
        path: menu.path || "",
        icon: menu.icon || "",
        parentId: menu.parentId ?? null,
        isActive: menu.isActive ?? true,
        sortOrder: menu.sortOrder ?? 0,
      });
    }
  }, [menu, reset]);

  const handleUpdate = async (data: MenuInput) => {
    try {
      await updateMenu(menu.id, data);
      await useMenuStore.getState().loadMenus(); // 🔁 Recarga Sidebar
      toast.success("Menú actualizado correctamente");
      onHide();
    } catch (error) {
      console.error("❌ Error al actualizar menú:", error);
      toast.error("Error al actualizar menú");
    }
  };

  return (
    <Dialog header="Editar Menú" visible={visible} style={{ width: "30rem" }} onHide={onHide}>
      <form onSubmit={handleSubmit(handleUpdate)} className="flex flex-col gap-3">
        <InputText {...register("name", { required: true })} placeholder="Nombre" />
        <InputText {...register("path")} placeholder="Ruta" />
        <InputText {...register("icon")} placeholder="Ícono" />
        <InputText {...register("parentId")} placeholder="ID del padre" />
        <InputText {...register("sortOrder")} placeholder="Orden" type="number" />

        <Controller
          name="isActive"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="isActive"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.checked)}
              />
              <label htmlFor="isActive">Activo</label>
            </div>
          )}
        />

        <Button type="submit" label="Actualizar" icon="pi pi-check" />
      </form>
    </Dialog>
  );
}

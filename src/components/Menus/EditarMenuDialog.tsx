import { Dialog } from "primereact/dialog";
import { updateMenu } from "@/services/menuService";
import { Menu } from "@/types/Menu";
import { MenuInput } from "@/types/Menu"; // ✅ este faltaba
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { toast } from "sonner";
import { useEffect } from "react";

interface EditarMenuDialogProps {
  visible: boolean;
  onHide: () => void;
  menu: Menu;
}

export default function EditarMenuDialog({ visible, onHide, menu }: EditarMenuDialogProps) {
  const { register, handleSubmit, reset } = useForm<MenuInput>();

  useEffect(() => {
    if (menu) reset(menu);
  }, [menu, reset]);

  const handleUpdate = async (data: MenuInput) => {
    try {
      await updateMenu(menu.id, data);
      toast.success("Menú actualizado");
      onHide();
    } catch {
      toast.error("Error al actualizar");
    }
  };

  return (
    <Dialog header="Editar Menú" visible={visible} style={{ width: "30rem" }} onHide={onHide}>
      <form onSubmit={handleSubmit(handleUpdate)} className="flex flex-col gap-3">
        <InputText {...register("name", { required: true })} placeholder="Nombre" />
        <InputText {...register("path")} placeholder="Ruta" />
        <InputText {...register("icon")} placeholder="Ícono" />
        <InputText {...register("parentId")} placeholder="ID del padre" />

        <Button type="submit" label="Actualizar" icon="pi pi-check" />
      </form>
    </Dialog>
  );
}

// src/components/Menus/EditarMenuDialog.tsx
import { Dialog } from "primereact/dialog";
import MenuForm from "./MenuForm";
import { updateMenu } from "@/services/menuService";
import { toast } from "sonner";

export default function EditarMenuDialog({ visible, onHide, menu }) {
  const handleUpdate = async (data) => {
    try {
      await updateMenu(menu.id, data);
      toast.success("Menú actualizado");
      onHide(true); // cerrar y recargar
    } catch {
      toast.error("Error al actualizar");
    }
  };

  return (
    <Dialog
      header="Editar Menú"
      visible={visible}
      style={{ width: "40vw" }}
      onHide={() => onHide(false)}
      modal
    >
      <MenuForm defaultValues={menu} onSubmit={handleUpdate} isEdit />
    </Dialog>
  );
}

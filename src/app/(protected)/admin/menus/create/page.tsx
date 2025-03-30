// 📁 src/app/(protected)/admin/menus/create/page.tsx
"use client";
import { useRouter } from "next/navigation";
import MenuForm from "@/components/menus/MenuForm";
import { createMenu } from "@/services/menuService";
import { toast } from "sonner";

export default function CreateMenuPage() {
  const router = useRouter();

  const handleCreate = async (data: any) => {
    try {
      await createMenu({
        ...data,
        padreId: data.padreId ? Number(data.padreId) : null,
      });
      toast.success("Menú creado correctamente");
      router.push("/admin/menus");
    } catch (err) {
      toast.error("Error al crear el menú");
    }
  };

  return (
    <div className="card">
      <h2>Crear Menú</h2>
      <MenuForm onSubmit={handleCreate} />
    </div>
  );
}

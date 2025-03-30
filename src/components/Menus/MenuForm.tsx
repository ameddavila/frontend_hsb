// src/components/menus/MenuForm.tsx
import { useForm, UseFormReturn } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { MenuInput, getMenus } from "@/services/menuService";
import { useEffect, useState } from "react";

interface Props {
  onSubmit: (data: MenuInput) => void;
  form?: UseFormReturn<MenuInput>;
}

function MenuForm({ onSubmit, form }: Props) {
  const fallbackForm = useForm<MenuInput>();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form ?? fallbackForm;

  const [menuOptions, setMenuOptions] = useState<{ label: string; value: number | null }[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await getMenus();
        const options = res.map((menu) => ({
          label: menu.name,
          value: menu.id,
        }));
        setMenuOptions([{ label: "Sin padre", value: null }, ...options]);
      } catch (err) {
        console.error("Error al cargar menús padre", err);
      }
    };
    fetchMenus();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid flex flex-col gap-4">
      <div>
        <label htmlFor="name">Nombre</label>
        <InputText id="name" {...register("name", { required: "El nombre es obligatorio" })} />
        {errors.name && <small className="p-error">{String(errors.name.message)}</small>}
      </div>

      <div>
        <label htmlFor="path">Ruta</label>
        <InputText id="path" {...register("path")} />
      </div>

      <div>
        <label htmlFor="icon">Ícono</label>
        <InputText id="icon" {...register("icon")} />
      </div>

      <div>
        <label htmlFor="parentId">Menú Padre</label>
        <Dropdown
          id="parentId"
          value={watch("parentId") ?? null}
          options={menuOptions}
          onChange={(e) => setValue("parentId", e.value)}
          placeholder="Selecciona un menú padre"
          className="w-full"
        />
      </div>

      <Button type="submit" label="Guardar" icon="pi pi-save" />
    </form>
  );
}

export default MenuForm; // ✅ NECESARIO para evitar el error

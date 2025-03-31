// src/components/menus/MenuForm.tsx
import { useForm, UseFormReturn } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { MenuInput, getMenus } from "@/services/menuService";
import { useEffect, useState } from "react";
import { IconSelectorModal } from "./IconSelectorModal";
import "primeicons/primeicons.css";

interface Props {
  onSubmit: (data: MenuInput) => void;
  form?: UseFormReturn<MenuInput>;
}

export default function MenuForm({ onSubmit, form }: Props) {
  const fallbackForm = useForm<MenuInput>();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form ?? fallbackForm;

  const [menuOptions, setMenuOptions] = useState<{ label: string; value: number | null }[]>([]);
  const [showIconModal, setShowIconModal] = useState(false);
  const selectedIcon = watch("icon");

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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
        <div className="flex flex-wrap gap-3 align-items-end">
          {/* Nombre */}
          <div className="flex flex-column w-12 md:w-3">
            <label htmlFor="name" className="font-medium mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <InputText
              id="name"
              {...register("name", { required: "El nombre es obligatorio" })}
              placeholder="Ej. Administración"
              className={errors.name ? "p-invalid" : ""}
            />
            {errors.name && <small className="p-error">{String(errors.name.message)}</small>}
          </div>

          {/* Ruta */}
          <div className="flex flex-column w-12 md:w-3">
            <label htmlFor="path" className="font-medium mb-1">
              Ruta
            </label>
            <InputText
              id="path"
              {...register("path")}
              placeholder="/ruta"
            />
          </div>

          {/* Ícono */}
          <div className="flex flex-column w-12 md:w-3">
            <label htmlFor="icon" className="font-medium mb-1">
              Ícono
            </label>
            <div className="flex align-items-center gap-2">
              <InputText
                id="icon"
                {...register("icon")}
                placeholder="pi pi-user"
                readOnly
                className="w-full"
              />
              <Button
                type="button"
                icon={selectedIcon || "pi pi-search"}
                className="p-button-outlined"
                onClick={() => setShowIconModal(true)}
                tooltip="Seleccionar ícono"
              />
            </div>
          </div>

          {/* Menú Padre */}
          <div className="flex flex-column w-12 md:w-3">
            <label htmlFor="parentId" className="font-medium mb-1">
              Menú Padre
            </label>
            <Dropdown
              id="parentId"
              value={watch("parentId") ?? null}
              options={menuOptions}
              onChange={(e) => setValue("parentId", e.value)}
              placeholder="Selecciona un menú padre"
              className="w-full"
            />
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-content-start w-12 md:w-auto mt-3">
            <Button
              type="submit"
              label="Guardar"
              icon="pi pi-save"
              severity="success"
              className="w-full md:w-auto"
            />
          </div>
        </div>
      </form>

      {/* Modal selector de íconos */}
      <IconSelectorModal
        visible={showIconModal}
        onHide={() => setShowIconModal(false)}
        onSelect={(icon) => {
          setValue("icon", icon);
          setShowIconModal(false);
        }}
      />
    </>
  );
}

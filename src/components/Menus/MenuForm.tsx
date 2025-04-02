// src/components/menus/MenuForm.tsx
"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { MenuInput, getMenus } from "@/services/menuService";
import { useEffect, useState } from "react";
import  IconSelectorModal  from "../ui/IconSelectorModal";
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
    watch
    } = form ?? fallbackForm;

  const [menuOptions, setMenuOptions] = useState<{ label: string; value: number | null }[]>([]);
  const [showIconModal, setShowIconModal] = useState(false);

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
      <form onSubmit={handleSubmit(onSubmit)} className="grid formgrid p-fluid gap-4">
        <div className="field col-12 md:col-6">
          <label htmlFor="name">Nombre</label>
          <InputText id="name" {...register("name")} />
        </div>

        <div className="field col-12 md:col-6">
          <label htmlFor="path">Ruta</label>
          <InputText id="path" {...register("path")} />
        </div>

        <div className="field col-12 md:col-6">
          <label htmlFor="icon">Ícono</label>
          <div className="flex align-items-center gap-2">
            <InputText id="icon" {...register("icon")} readOnly />
            <Button type="button" icon="pi pi-search" onClick={() => setShowIconModal(true)} />
          </div>
        </div>

        <div className="field col-12 md:col-6">
          <label htmlFor="parentId">Menú Padre</label>
          <Dropdown
            id="parentId"
            value={watch("parentId") ?? null}
            options={menuOptions}
            onChange={(e) => setValue("parentId", e.value)}
            placeholder="Selecciona un menú padre"
          />
        </div>

        <div className="col-12 flex justify-content-start">
          <Button type="submit" label="Guardar" icon="pi pi-save" />
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

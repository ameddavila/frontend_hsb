// 📁 src/components/menus/MenuForm.tsx
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { classNames } from "primereact/utils";

const schema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  ruta: z.string().min(1, "Ruta requerida"),
  icono: z.string().min(1, "Ícono requerido"),
  padreId: z.union([z.string(), z.number(), z.null()]).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  isEditing?: boolean;
  loading?: boolean;
}

export default function MenuForm({ defaultValues, onSubmit, isEditing = false, loading }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid grid gap-3">
      <div className="col-12 md:col-6">
        <label htmlFor="nombre">Nombre</label>
        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <InputText id="nombre" {...field} className={classNames({ "p-invalid": errors.nombre })} size="small" />
          )}
        />
      </div>

      <div className="col-12 md:col-6">
        <label htmlFor="ruta">Ruta</label>
        <Controller
          name="ruta"
          control={control}
          render={({ field }) => (
            <InputText id="ruta" {...field} className={classNames({ "p-invalid": errors.ruta })} size="small" />
          )}
        />
      </div>

      <div className="col-12 md:col-6">
        <label htmlFor="icono">Ícono</label>
        <Controller
          name="icono"
          control={control}
          render={({ field }) => (
            <InputText id="icono" {...field} className={classNames({ "p-invalid": errors.icono })} size="small" />
          )}
        />
      </div>

      <div className="col-12 md:col-6">
        <label htmlFor="padreId">ID del Padre (opcional)</label>
        <Controller
          name="padreId"
          control={control}
          render={({ field }) => (
            <InputText id="padreId" {...field} size="small" keyfilter="pint" />
          )}
        />
      </div>

      <div className="col-12">
        <Button label={isEditing ? "Actualizar" : "Crear"} icon="pi pi-save" type="submit" loading={loading} />
      </div>
    </form>
  );
}

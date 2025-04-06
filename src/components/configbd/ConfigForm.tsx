// src/components/configbd/ConfigForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DbConnectionInput  } from "@/types/DbConnection";

interface Props {
  defaultValues?: DbConnectionInput;
  onSubmit: (data: DbConnectionInput) => Promise<void>;
}

const schema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  servidor: z.string().min(1, "El servidor es obligatorio"),
  puerto: z.coerce.number().min(1, "Puerto inválido"),
  baseDatos: z.string().min(1, "La base de datos es obligatoria"),
  usuario: z.string().min(1, "El usuario es obligatorio"),
  contrasena: z.string().min(1, "La contraseña es obligatoria"),
  ssl: z.boolean().default(false),
});

export default function ConfigForm({ defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DbConnectionInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid space-y-4">
      <div>
        <label htmlFor="nombre">Nombre</label>
        <InputText id="nombre" {...register("nombre")} />
        {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
      </div>

      <div>
        <label htmlFor="descripcion">Descripción</label>
        <InputText id="descripcion" {...register("descripcion")} />
      </div>

      <div>
        <label htmlFor="servidor">Servidor</label>
        <InputText id="servidor" {...register("servidor")} />
        {errors.servidor && <small className="p-error">{errors.servidor.message}</small>}
      </div>

      <div>
        <label htmlFor="puerto">Puerto</label>
        <InputText id="puerto" {...register("puerto")} />
        {errors.puerto && <small className="p-error">{errors.puerto.message}</small>}
      </div>

      <div>
        <label htmlFor="baseDatos">Base de Datos</label>
        <InputText id="baseDatos" {...register("baseDatos")} />
        {errors.baseDatos && <small className="p-error">{errors.baseDatos.message}</small>}
      </div>

      <div>
        <label htmlFor="usuario">Usuario</label>
        <InputText id="usuario" {...register("usuario")} />
        {errors.usuario && <small className="p-error">{errors.usuario.message}</small>}
      </div>

      <div>
        <label htmlFor="contrasena">Contraseña</label>
        <InputText id="contrasena" type="password" {...register("contrasena")} />
        {errors.contrasena && <small className="p-error">{errors.contrasena.message}</small>}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register("ssl")} /> Usar SSL
        </label>
      </div>

      <Button label="Guardar Conexión" icon="pi pi-save" type="submit" />
    </form>
  );
}

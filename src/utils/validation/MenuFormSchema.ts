// src/utils/validation/MenuFormSchema.ts
import { z } from "zod";

export const menuSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  ruta: z.string().min(1, "La ruta es obligatoria"),
  icono: z.string().min(1, "El icono es obligatorio"),
  padreId: z.union([z.number(), z.null()]).optional(),
});

export type MenuFormValues = z.infer<typeof menuSchema>;

import { z } from "zod";

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, "Debe tener al menos 3 caracteres"),
  password: z.string().min(8, "Debe tener al menos 8 caracteres"),
});

export const registerSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

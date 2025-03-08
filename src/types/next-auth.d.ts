import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    roleName?: string; // ✅ Agregar roleName
    csrfToken?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      roleName?: string; // ✅ Agregar roleName aquí también
      csrfToken?: string;
    } & DefaultSession["user"];
  }
}

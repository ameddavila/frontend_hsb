import NextAuth from "next-auth";

// 🔹 Agrega este comentario para evitar el warning
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unusedNextAuth = NextAuth;
// ✅ Extender correctamente los tipos de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      roleId?: number;
      roleName?: string;
      accessToken?: string;
      refreshToken?: string;
    };
    error?: string;
  }

  interface User {
    id: string;
    role: string;
    roleId?: number;
    roleName?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

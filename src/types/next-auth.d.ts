/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    roleName?: string;
    csrfToken?: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}

export {};

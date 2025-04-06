export interface DbConnection {
    id: number;
    nombre: string;
    descripcion?: string;
    servidor: string;
    baseDatos: string;
    puerto: number;
    usuario: string;
    contrasena: string;
    ssl: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  // Para formularios (crear/editar) puedes usar esto:
  export type DbConnectionInput = Omit<DbConnection, "id" | "createdAt" | "updatedAt">;
  
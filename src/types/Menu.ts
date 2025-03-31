// Base plano recibido del backend
export interface Menu {
  id: number;
  name: string;
  path: string;
  icon?: string;
  parentId?: number | null;
  isActive?: boolean;
  sortOrder?: number;
  external?: boolean;                 // 🔗 Si es un link externo (opcional)
  visibleToRoles?: string[];         // 🧑‍💼 Visibilidad por roles
  requiredPermissions?: string[];    // 🔐 Visibilidad por permisos
}

// Input usado en formularios (crear/editar)
export interface MenuInput {
  name: string;
  path: string;
  icon?: string;
  parentId?: number | null;
  external?: boolean;
  visibleToRoles?: string[];
  requiredPermissions?: string[];
}

// Árbol jerárquico para Sidebar y PanelMenu
export interface MenuNode extends Menu {
  parentId: number | null;       // Normalizado para evitar undefined
  children: MenuNode[];          // Árbol recursivo
}

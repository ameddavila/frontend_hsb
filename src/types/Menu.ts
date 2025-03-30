// Base plano recibido del backend
export interface Menu {
  id: number;
  name: string;
  path: string;
  icon?: string;
  parentId?: number | null;
  isActive?: boolean;
  sortOrder?: number;
}

// Input usado en formularios (crear/editar)
export interface MenuInput {
  name: string;
  path: string;
  icon?: string;
  parentId?: number | null;
}

// Árbol jerárquico (usado en Sidebar/PanelMenu)
export interface MenuNode extends Menu {
  parentId: number | null; // ✅ ahora explícitamente requerido
  children: MenuNode[];
}

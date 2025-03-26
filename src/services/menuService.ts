import api from "./api";

export const fetchUserMenus = async () => {
  try {
    const response = await api.get("/menus/my-menus");
    console.log("📦 Menús desde menuService:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener menús desde menuService:", error);
    throw error; // Opcional, o podrías devolver [] si prefieres fallar en silencio
  }
};

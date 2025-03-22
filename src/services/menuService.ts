import api from "./api"; // este ya tiene CSRF y manejo de tokens

export const fetchUserMenus = async () => {
  const response = await api.get("/menus/my-menus");
  return response.data;
};

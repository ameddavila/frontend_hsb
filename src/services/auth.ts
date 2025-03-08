import axios from "axios";

interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const registerUser = async (data: RegisterUserData): Promise<void> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Error en el registro";
    }
    throw "Error inesperado en el registro";
  }
};

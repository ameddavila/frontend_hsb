import { FieldValues } from "react-hook-form";

export interface RegisterFormInputs extends FieldValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

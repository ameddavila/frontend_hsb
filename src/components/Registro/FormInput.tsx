import { Controller, FieldErrors } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

interface FormInputProps {
  name: string;
  label: string;
  control: any;
  type?: "text" | "email" | "password";
  errors: FieldErrors;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ name, label, control, type = "text", errors, required = false }) => {
  return (
    <div className="p-field">
      <label htmlFor={name}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          type === "password" ? <Password {...field} toggleMask feedback={false} /> : <InputText {...field} type={type} />
        }
      />
      {errors[name] && <small className="p-error">{errors[name]?.message as string}</small>}
    </div>
  );
};

export default FormInput;

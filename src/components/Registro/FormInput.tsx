import { Controller, Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  type?: "text" | "email" | "password";
  errors: FieldErrors<T>;
  required?: boolean;
}

const FormInput = <T extends FieldValues>({
  name,
  label,
  control,
  type = "text",
  errors,
  required = false,
}: FormInputProps<T>) => {
  return (
    <div className="p-field">
      <label htmlFor={String(name)}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          type === "password" ? (
            <Password {...field} toggleMask feedback={false} />
          ) : (
            <InputText {...field} type={type} />
          )
        }
      />
      {errors[name] && <small className="p-error">{errors[name]?.message?.toString()}</small>}
    </div>
  );
};

export default FormInput;

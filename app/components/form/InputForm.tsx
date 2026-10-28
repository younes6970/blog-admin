import { Controller } from "react-hook-form";
import { Input } from "~/components/ui/input";
import ErrorForm from "./ErrorForm";
import classNames from "classnames";
import { cn } from "~/lib/utils";

type InputFormProps = {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  classNameInput?: string;
} & React.ComponentProps<typeof Input>;

function InputForm({
  name,
  label,
  icon,
  classNameInput,
  ...props
}: InputFormProps) {
  return (
    <Controller
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className="flex flex-col w-full">
          {label && (
            <label
              htmlFor={name}
              className={classNames("block text-sm font-medium  mb-2", {
                "text-red-600": error,
                "text-gray-700": !error,
              })}
            >
              {label}
            </label>
          )}
          <div className="relative">
            <Input
              id={name}
              name={name}
              value={value ?? ""}
              onChange={onChange}
              dir="rtl"
              className={cn(
                classNames("placeholder:text-right", {
                  "border-red-300 focus:border-red-500": error,
                }),
                classNameInput,
              )}
              {...props}
            />
            {!!icon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {icon}
              </div>
            )}
          </div>
          <ErrorForm message={error?.message} />
        </div>
      )}
    />
  );
}

export default InputForm;

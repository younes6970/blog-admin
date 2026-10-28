import { Controller } from "react-hook-form";
import { Textarea } from "~/components/ui/textarea";
import ErrorForm from "./ErrorForm";
import classNames from "classnames";
import { cn } from "~/lib/utils";

type TextareaFormProps = {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  classNameTextarea?: string;
} & React.ComponentProps<typeof Textarea>;

function TextareaForm({
  name,
  label,
  icon,
  classNameTextarea,
  ...props
}: TextareaFormProps) {
  return (
    <Controller
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className="flex flex-col w-full">
          {label && (
            <label
              htmlFor={name}
              className={classNames("block text-sm font-medium mb-2", {
                "text-red-600": error,
                "text-gray-700": !error,
              })}
            >
              {label}
            </label>
          )}

          <div className="relative">
            <Textarea
              id={name}
              name={name}
              value={value ?? ""}
              onChange={onChange}
              dir="rtl"
              className={cn(
                classNames("placeholder:text-right", {
                  "border-red-300 focus:border-red-500": error,
                }),
                classNameTextarea
              )}
              {...props}
            />

            {!!icon && <div className="absolute right-3 top-3">{icon}</div>}
          </div>

          <ErrorForm message={error?.message} />
        </div>
      )}
    />
  );
}

export default TextareaForm;

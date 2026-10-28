import classNames from "classnames";
import { Controller } from "react-hook-form";
import {
  NumericFormat,
  type NumberFormatValues,
  type NumericFormatProps,
} from "react-number-format";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import ErrorForm from "./ErrorForm";

export type NumericFormProps = {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  defaultValue?: number | string;
  classNameController?: string;
  classNameInput?: string;
  onChange?: (value: number | undefined) => void;
} & Omit<React.ComponentProps<typeof Input>, "type" | "value" | "defaultValue" | "onChange"> &
  Omit<
    NumericFormatProps,
    "type" | "value" | "defaultValue" | "customInput" | "onChange" | "onValueChange"
  >;

export default function NumericForm({
  name,
  label,
  icon,
  defaultValue,
  classNameController,
  classNameInput,
  onChange,
  thousandSeparator = ",",
  decimalSeparator = ".",
  allowNegative = false,
  ...props
}: NumericFormProps) {
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field: { value, onChange: onChangeField, onBlur, ref }, fieldState: { error } }) => (
        <div className={cn("flex flex-col w-full", classNameController)}>
          {label && (
            <label
              htmlFor={name}
              className={classNames("mb-2 block text-sm font-medium", {
                "text-red-600": error,
                "text-gray-700": !error,
              })}
            >
              {label}
            </label>
          )}
          <div className="relative">
            <NumericFormat
              {...props}
              id={name}
              name={name}
              getInputRef={ref}
              value={value ?? ""}
              type="text"
              inputMode="decimal"
              customInput={Input}
              thousandSeparator={thousandSeparator}
              decimalSeparator={decimalSeparator}
              allowNegative={allowNegative}
              onBlur={onBlur}
              onValueChange={(values: NumberFormatValues) => {
                onChangeField(values.floatValue ?? "");
                onChange?.(values.floatValue);
              }}
              aria-invalid={Boolean(error)}
              className={cn(
                "text-left tabular-nums",
                icon && "pr-9",
                error && "border-red-300 focus:border-red-500",
                classNameInput,
              )}
              dir="ltr"
            />
            {icon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
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

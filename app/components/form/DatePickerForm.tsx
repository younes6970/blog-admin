import { Controller } from "react-hook-form";
import classNames from "classnames";

import ErrorForm from "./ErrorForm";
import { cn } from "~/lib/utils";
import DatePicker from "../ui/datePicker";
import type { CalendarProps } from "../ui/calendar";

type DatePickerFormProps = {
  name: string;
  label?: string;
  classNamePicker?: string;
  placeholder?: string;
  disabled?: CalendarProps["disabled"];
  defaultValue?: string;
};

function DatePickerForm({
  name,
  label,
  classNamePicker,
  placeholder,
  disabled,
  defaultValue,
}: DatePickerFormProps) {
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
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

          <DatePicker
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              classNames({
                "border-red-300 focus:border-red-500": error,
              }),
              classNamePicker,
            )}
          />

          <ErrorForm message={error?.message} />
        </div>
      )}
    />
  );
}

export default DatePickerForm;

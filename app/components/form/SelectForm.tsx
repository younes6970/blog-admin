import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ErrorForm from "./ErrorForm";
import classNames from "classnames";

export type SelectFormOption = {
  value: string;
  label: string;
};

type SelectFormProps = {
  name: string;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  options: SelectFormOption[];
  renderOption?: (option: SelectFormOption) => React.ReactNode;
  renderValue?: (option: SelectFormOption) => React.ReactNode;
};

function SelectForm({
  name,
  defaultValue = "",
  label,
  placeholder,
  options,
  renderOption,
  renderValue,
}: SelectFormProps) {
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const selectedOption = options.find(
          (option) => option.value === String(value ?? ""),
        );

        return (
        <div className="flex flex-col w-full">
          {label && (
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {label}
            </label>
          )}
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger
              className={classNames(error ? "border-red-300 focus:border-red-500" : "" , "w-full")}
            >
              <SelectValue placeholder={placeholder}>
                {selectedOption
                  ? renderValue?.(selectedOption) ?? selectedOption.label
                  : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-full">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                    {renderOption?.(option) ?? option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorForm message={error?.message} />
        </div>
        );
      }}
    />
  );
}

export default SelectForm;

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  className?: string;
  name?: string;
  renderOption?: (option: SearchableSelectOption) => React.ReactNode;
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "انتخاب کنید...",
  className = "w-full",
  name,
  renderOption,
}: SearchableSelectProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Select name={name} value={value || ""} onValueChange={onValueChange}>
      <SelectTrigger
        className={`${className} text-right border-gray-300`}
        dir="rtl"
        
      >
        <SelectValue placeholder={placeholder}>
          {selectedOption?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border-gray-300" dir="rtl">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-right"
          >
            {renderOption ? renderOption(option) : option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

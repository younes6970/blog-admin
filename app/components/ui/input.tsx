import * as React from "react";

import { cn } from "~/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  dir?: "ltr" | "rtl" | "auto";
}

// تبدیل اعداد فارسی به انگلیسی
const convertPersianToEnglish = (str: string) => {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let result = str;
  for (let i = 0; i < persianNumbers.length; i++) {
    result = result.replace(
      new RegExp(persianNumbers[i], "g"),
      englishNumbers[i],
    );
  }
  return result;
};

function Input({
  className,
  type,
  dir = "rtl",
  onChange,
  onInput,
  ...props
}: InputProps) {
  // Handler برای input های عددی
  const handleNumberInput = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const cursorPosition = input.selectionStart;

      // تبدیل اعداد فارسی به انگلیسی
      let value = convertPersianToEnglish(input.value);

      // فقط اعداد و کاراکترهای مجاز رو نگه دار
      if (type === "number") {
        value = value.replace(/[^\d.-]/g, "");
      } else if (type === "tel") {
        value = value.replace(/[^\d\s\-\+\(\)]/g, "");
      }

      // اگر مقدار تغییر کرده باشه، آپدیت کن
      if (input.value !== value) {
        input.value = value;

        // مکان cursor رو حفظ کن
        if (cursorPosition !== null) {
          input.setSelectionRange(cursorPosition, cursorPosition);
        }

        // Event رو trigger کن
        if (onChange) {
          const event = new Event("change", { bubbles: true });
          Object.defineProperty(event, "target", {
            writable: false,
            value: input,
          });
          onChange(event as any);
        }
      }

      if (onInput) {
        onInput(e);
      }
    },
    [type, onChange, onInput],
  );

  return (
    <input
      type={type}
      data-slot="input"
      dir={dir}
      onInput={handleNumberInput}
      onChange={onChange}
      className={cn(
        "relative text-start file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-gray-300 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-body-dasht transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:border-destructive",
        dir === "rtl" ? "text-right" : "text-left",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

import { forwardRef } from "react";
import { cn } from "~/lib/utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  description?: string;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { className, label, error, required, description, children, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <label
            className={cn(
              "text-sm font-medium text-gray",
              error && "text-danger-dasht"
            )}
          >
            {label}
            {required && <span className="text-danger-dasht ml-1">*</span>}
          </label>
        )}
        {children}
        {description && !error && (
          <p className="text-xs text-gray-light">{description}</p>
        )}
        {error && (
          <p className="text-xs text-danger-dasht font-medium">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export { FormField };

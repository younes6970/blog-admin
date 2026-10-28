import * as React from "react";
import { cn } from "~/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  dir?: "ltr" | "rtl" | "auto";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, dir = "rtl", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        dir={dir}
        className={cn(
          "relative text-start placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "dark:bg-input/30 border-gray-300 flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-body-dasht md:text-sm",
          "outline-none transition-[color,box-shadow] resize-y",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive",
          dir === "rtl" ? "text-right" : "text-left",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

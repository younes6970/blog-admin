import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      color: {
        white:
          "bg-white border-white text-gray-900 hover:bg-gray-50 hover:text-blue-600",
        main: "bg-main border-main text-main hover:bg-main/90 hover:text-white",
        success:
          "bg-success border-success text-success hover:bg-success/90 hover:text-white",
        primary:
          "bg-primary-dasht border-primary-dasht text-primary-dasht hover:bg-primary-dasht/90 hover:text-white",
        secondary:
          "bg-gray-600 border-gray-600 text-white hover:bg-gray-700 hover:text-white",
        destructive:
          "bg-danger-dasht border-danger-dasht text-danger-dasht hover:bg-danger-dasht/90 hover:text-white",
        warning:
          "bg-warning-dasht border-warning-dasht text-warning-dasht hover:bg-warning-dasht/90 hover:text-white",
        transparent: "text-inherit",
        info: "bg-info-dasht border-info-dasht text-info-dasht hover:bg-info-dasht/90 hover:text-white",
      },
      variant: {
        default: "shadow-xs text-white",
        outline:
          "border bg-transparent shadow-xs dark:bg-input/30 dark:border-gray-300 dark:hover:bg-input/50",
        ghost: "bg-transparent dark:hover:bg-accent/50",
      },
      size: {
        default: "h-9 px-4 py-2 ",
        sm: "h-8 gap-1.5 px-3 ",
        lg: "h-10 px-6 ",
        icon: "size-9",
        full: "w-full h-9 px-4 py-2",
        text: "p-0 m-0 h-auto hover:bg-transparent",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      color: "main",
      rounded: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  color,
  asChild = false,
  disabled,
  loading,
  rounded,
  id,
  classNameLoader,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    id?: string;
    classNameLoader?: string;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      id={id}
      data-slot="button"
      className={cn(
        "relative",
        buttonVariants({ variant, size, color, rounded }),
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      <Slottable>{props.children}</Slottable>
      {loading && (
        <LoaderCircle
          className={cn(
            "size-6 animate-spin absolute top-1/2 text-white -translate-1/2 left-1/2",
            classNameLoader,
          )}
        />
      )}
    </Comp>
  );
}

export { Button, buttonVariants };

"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { Label } from "./label";
import { cn } from "~/lib/utils";

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  label?: string;
  renderLabel?: React.ReactNode;
  name: string;
  classNameLabel?: string;
};

function Checkbox({
  className,
  label,
  name,
  renderLabel,
  classNameLabel,
  ...props
}: CheckboxProps) {
  return (
    <div className="flex w-full items-center justify-start gap-2">
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={cn(
          "peer border-main border-inputgray:bg-input/30 data-[state=checked]:bg-main data-[state=checked]:text-secondary-foregroundgray:data-[state=checked]:bg-primary-800 data-[state=checked]:border-primary-800 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20gray:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 cursor-pointer rounded-md border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
        id={name}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="flex items-center justify-center text-current transition-none"
        >
          <CheckIcon className="size-3.5 text-white" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {renderLabel || (
        <Label htmlFor={name} className={classNameLabel}>
          {label}
        </Label>
      )}
    </div>
  );
}

export { Checkbox };

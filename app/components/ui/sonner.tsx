import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      richColors={true}
      className="toaster group"
      style={{
        fontFamily: "'Chain', system-ui, sans-serif",
      }}
      toastOptions={{
        style: {
          fontFamily: "'Chain', system-ui, sans-serif",
          fontSize: "14px",
          padding: "12px 16px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
        duration: 4000,
      }}
      {...props}
    />
  );
};

export { Toaster };

import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";

type ButtonFormProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  type?: "submit" | "reset";
} & React.ComponentProps<typeof Button>;

function ButtonForm({
  children,
  isLoading,
  type = "submit",
  disabled,
  ...props
}: ButtonFormProps) {
  const { formState } = useFormContext();

  const isFormLoading = isLoading || formState.isSubmitting;
  const isDisabled = disabled || isFormLoading || !formState.isValid;

  return (
    <Button
      type={type}
      disabled={isDisabled}
      loading={isFormLoading}
      {...props}
    >
      {children}
    </Button>
  );
}

export default ButtonForm;

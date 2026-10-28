import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import type { ZodType } from "zod";
import { cn } from "~/lib/utils";

type FormProps<T extends FieldValues> = {
  schema: ZodType<T, FieldValues>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  defaultValues?: DefaultValues<T>;
  className?: string;
};

function Form<T extends FieldValues>({
  onSubmit,
  schema,
  children,
  defaultValues,
  className,
}: FormProps<T>) {
  const formMethods = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    shouldUseNativeValidation: false,
    defaultValues: defaultValues || ({} as DefaultValues<T>),
  });

  return (
    <FormProvider {...formMethods}>
      <form
        className={cn("w-full h-full", className)}
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export default Form;

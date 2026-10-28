import type { ComponentProps, ReactNode } from "react";
import { Button } from "./button";
import { DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";

/** Shared modal layout: fixed header/actions, a single scrollable content area. */
export function ModalContent({ title, description, footer, children, ...props }: Omit<ComponentProps<typeof DialogContent>, "title"> & {
  title: string; description?: string; footer?: ReactNode;
}) {
  return <DialogContent {...(!description ? { "aria-describedby": undefined } : {})} {...props}>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      {description && <DialogDescription>{description}</DialogDescription>}
    </DialogHeader>
    <DialogBody>{children}</DialogBody>
    <DialogFooter>{footer ?? <DialogClose asChild><Button className="bg-stone-900 text-white hover:bg-stone-700">بستن</Button></DialogClose>}</DialogFooter>
  </DialogContent>;
}

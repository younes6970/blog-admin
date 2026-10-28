import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { ModalContent } from "./ui/modal";

export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel, destructive = false }: {
  open: boolean; title: string; description: string; confirmLabel: string;
  onConfirm: () => void; onCancel: () => void; destructive?: boolean;
}) {
  return <Dialog open={open} onOpenChange={(value) => { if (!value) onCancel(); }}>
    <ModalContent title={title} showCloseButton={false} footer={<>
        <Button autoFocus variant="outline" color="transparent" onClick={onCancel}>انصراف و بازگشت</Button>
        <Button className={destructive ? "bg-red-600 text-white" : ""} onClick={onConfirm}>{confirmLabel}</Button>
      </>}>
      <p className="break-words text-sm leading-7 text-stone-600">{description}</p>
    </ModalContent>
  </Dialog>;
}

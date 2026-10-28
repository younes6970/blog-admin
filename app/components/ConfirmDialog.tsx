import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";

export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel, destructive = false }: {
  open: boolean; title: string; description: string; confirmLabel: string;
  onConfirm: () => void; onCancel: () => void; destructive?: boolean;
}) {
  return <Dialog open={open} onOpenChange={(value) => { if (!value) onCancel(); }}>
    <DialogContent dir="rtl" showCloseButton={false}>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription className="break-words leading-7 text-slate-600">{description}</DialogDescription>
      <DialogFooter>
        <Button autoFocus variant="outline" color="transparent" onClick={onCancel}>انصراف و بازگشت</Button>
        <Button className={destructive ? "bg-red-600 text-white" : ""} onClick={onConfirm}>{confirmLabel}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

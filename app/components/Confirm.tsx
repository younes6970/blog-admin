import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
type Props = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: React.ComponentProps<typeof Button>["color"];
};
export default function Confirm({
  onClose,
  onConfirm,
  open,
  loading,
  title = "تأیید عملیات",
  description = "آیا از انجام این عملیات مطمئن هستید؟",
  confirmText = "تأیید",
  cancelText = "انصراف",
  confirmColor = "main",
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm leading-6">
          {description}
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              color="destructive"
              size="sm"
              className="w-24"
            >
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            color={confirmColor}
            size="sm"
            className="w-24"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

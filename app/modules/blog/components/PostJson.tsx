import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Copy, Download } from "lucide-react";
import type { BlogPost } from "../types";
import { downloadPost, serializePost } from "../utils";

export default function PostJson({ post }: { post: BlogPost }) {
  const json = useMemo(() => serializePost(post), [post]);
  return <div className="p-4">
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Button variant="outline" color="transparent" onClick={async () => {
        try { await navigator.clipboard.writeText(json); toast.success("JSON کپی شد."); }
        catch { toast.error("دسترسی به کلیپ‌بورد ممکن نیست؛ فایل را دانلود کنید."); }
      }}><Copy size={16} />کپی JSON</Button>
      <Button onClick={() => downloadPost(post)}><Download size={16} />دانلود JSON</Button>
    </div>
    <pre dir="ltr" tabIndex={0} className="max-h-[70vh] overflow-auto whitespace-pre-wrap break-all rounded-xl bg-slate-950 p-5 text-left font-mono text-xs leading-6 text-slate-200">{json}</pre>
  </div>;
}

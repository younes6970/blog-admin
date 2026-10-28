import { lazy, Suspense, useDeferredValue, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowRight, Check, Code2, Eye, PencilLine } from "lucide-react";
import { ConfirmDialog } from "~/components/ConfirmDialog";
import { Dialog } from "~/components/ui/dialog";
import { ModalContent } from "~/components/ui/modal";
import { usePostEditor } from "./hooks/usePostEditor";
import PostPreview from "./components/PostPreview";

const ContentBuilder = lazy(() => import("./components/ContentBuilder"));
const PostJson = lazy(() => import("./components/PostJson"));
const PostJsonActions = lazy(() => import("./components/PostJson").then((module) => ({ default: module.PostJsonActions })));
export default function PostEditorPage() {
  const { id } = useParams();
  const editor = usePostEditor(id);
  const preview = useDeferredValue(editor.post);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [jsonOpen, setJsonOpen] = useState(false);
  if (editor.error) return <div role="alert" className="p-12 text-center"><p>{editor.error}</p><Link to="/posts" className="mt-4 inline-block text-main">بازگشت به پست‌ها</Link></div>;
  if (!editor.post || !editor.metadata) return <p role="status" className="p-12 text-center text-sm text-stone-400">در حال آماده‌سازی مطلب…</p>;
  return <div className="min-h-screen bg-white text-stone-800">
    <header className="sticky top-0 z-40 flex min-h-[73px] flex-wrap items-center justify-between gap-3 border-b border-stone-200/70 bg-white px-4 py-3 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-4"><Link to="/posts" title="بازگشت به پست‌ها" className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-800"><ArrowRight size={18} /></Link><div className="hidden h-5 w-px bg-stone-200 sm:block" /><span className="text-xs text-stone-500">{id ? "ویرایش مطلب" : "مطلب جدید"}</span><span role="status" className="hidden text-[10px] text-stone-400 sm:flex">{editor.dirty ? "ذخیره نشده" : <span className="flex items-center gap-1"><Check size={12} />بدون تغییر ذخیره‌نشده</span>}</span></div>
      <div className="flex items-center gap-1 sm:gap-3">
        <button type="button" title={mode === "edit" ? "پیش‌نمایش بدون ابزار" : "بازگشت به ویرایش"} aria-pressed={mode === "preview"} onClick={() => setMode(mode === "edit" ? "preview" : "edit")} className="inline-flex items-center gap-2 rounded-lg p-2 text-xs text-stone-500 hover:bg-stone-100">{mode === "edit" ? <Eye size={16} /> : <PencilLine size={16} />}<span className="hidden sm:inline">{mode === "edit" ? "پیش‌نمایش" : "ویرایش"}</span></button>
        <button type="button" aria-label="خروجی JSON" title="خروجی JSON" onClick={() => setJsonOpen(true)} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"><Code2 size={17} /></button>
        <select aria-label="وضعیت پست" value={editor.metadata.status} onChange={(event) => editor.updateMetadata({ status: event.target.value as "draft" | "published" })} className="max-w-28 rounded-lg border-0 bg-transparent px-1 py-2 text-[11px] text-stone-500 outline-none"><option value="draft">پیش‌نویس</option><option value="published">منتشرشده</option></select>
        <button type="button" onClick={editor.save} className="rounded-lg bg-stone-900 px-5 py-2.5 text-xs text-white transition-colors hover:bg-stone-700">ذخیره</button>
      </div>
    </header>
    {mode === "edit" ? <Suspense fallback={<p className="p-12 text-center text-xs text-stone-400">در حال آماده‌سازی محیط نوشتن…</p>}><ContentBuilder metadata={editor.metadata} onMetadataChange={editor.updateMetadata} blocks={editor.blocks} onChange={editor.setBlocks} /></Suspense> : <div className="mx-auto max-w-[800px] px-3 py-12"><PostPreview post={preview ?? editor.post} /></div>}
    <Dialog open={jsonOpen} onOpenChange={setJsonOpen}><ModalContent title="خروجی مطلب" description="داده‌ی ساختاریافته با ترتیب بلوک‌ها، آماده‌ی ارسال به بک‌اند." className="sm:max-w-3xl"
      footer={<Suspense fallback={<span className="text-xs text-stone-400">در حال آماده‌سازی…</span>}><PostJsonActions post={editor.post} /></Suspense>}>
      <Suspense fallback={<p>در حال آماده‌سازی…</p>}><PostJson post={editor.post} /></Suspense>
    </ModalContent></Dialog>
    <ConfirmDialog open={editor.blocker.state === "blocked"} title="تغییرات ذخیره نشده‌اند" description="با خروج از این صفحه تغییرات از دست می‌روند." confirmLabel="خروج بدون ذخیره" onCancel={() => editor.blocker.reset?.()} onConfirm={() => editor.blocker.proceed?.()} />
  </div>;
}

import { lazy, Suspense, useDeferredValue, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowRight, Check, Code2, Eye, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ConfirmDialog } from "~/components/ConfirmDialog";
import { usePostEditor } from "./hooks/usePostEditor";
import PostMetadata from "./components/PostMetadata";
import PostPreview from "./components/PostPreview";

const ContentBuilder = lazy(() => import("./components/ContentBuilder"));
const PostJson = lazy(() => import("./components/PostJson"));
export default function PostEditorPage() {
  const { id } = useParams();
  const editor = usePostEditor(id);
  const preview = useDeferredValue(editor.post);
  const [tab, setTab] = useState<"preview" | "json">("preview");
  const [width, setWidth] = useState<"desktop" | "mobile">("desktop");
  if (editor.error) return <div role="alert" className="rounded-xl border bg-white p-8 text-center"><p>{editor.error}</p><Link to="/posts" className="mt-4 inline-block text-main">بازگشت به پست‌ها</Link></div>;
  if (!editor.post || !editor.metadata) return <p role="status" className="p-8 text-center text-slate-500">در حال آماده‌سازی ویرایشگر…</p>;
  return <div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3"><Link to="/posts" aria-label="بازگشت به پست‌ها" className="rounded-xl border bg-white p-2"><ArrowRight size={19} /></Link><div><h1 className="text-xl font-bold text-slate-900">{id ? "ویرایش پست" : "ساخت پست جدید"}</h1><p className="mt-1 text-xs text-slate-500">محتوا را بسازید؛ نتیجه را هم‌زمان ببینید.</p></div></div>
      <div className="flex flex-wrap items-center gap-3"><span role="status" className="text-xs text-slate-500">{editor.dirty ? "تغییرات ذخیره نشده" : <span className="flex items-center gap-1"><Check size={14} />بدون تغییر ذخیره‌نشده</span>}</span><Button onClick={editor.save}><Save size={16} />ذخیره پست</Button></div>
    </header>
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-800">نسخه‌ی محلی: پست‌ها فقط در همین مرورگر ذخیره می‌شوند. وضعیت «منتشرشده» فعلاً مطلبی را به سایت ارسال نمی‌کند.</div>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="min-w-0 space-y-6"><PostMetadata value={editor.metadata} onChange={editor.updateMetadata} /><Suspense fallback={<p>در حال بارگذاری ابزار محتوا…</p>}><ContentBuilder blocks={editor.blocks} onChange={editor.setBlocks} /></Suspense></div>
      <section className="min-w-0 overflow-hidden rounded-2xl border bg-slate-100 xl:sticky xl:top-4">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-3">
          <div className="flex gap-1">{(["preview", "json"] as const).map((item) => <button key={item} type="button" aria-pressed={tab === item} onClick={() => setTab(item)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${tab === item ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}>{item === "preview" ? <><Eye size={15} />پیش‌نمایش سایت</> : <><Code2 size={15} />خروجی JSON</>}</button>)}</div>
          {tab === "preview" && <div className="flex gap-2">{(["desktop", "mobile"] as const).map((item) => <button key={item} type="button" aria-pressed={width === item} onClick={() => setWidth(item)} className={`rounded px-2 py-1 text-xs ${width === item ? "bg-slate-100 text-slate-900" : "text-slate-400"}`}>{item === "desktop" ? "دسکتاپ" : "موبایل"}</button>)}</div>}
        </header>
        <div className="max-h-[85vh] overflow-auto p-3 sm:p-5">
          {tab === "preview" ? <div className={`mx-auto overflow-hidden rounded-xl border bg-white shadow-sm ${width === "mobile" ? "max-w-[390px]" : "w-full"}`}><PostPreview post={preview ?? editor.post} /></div> : <Suspense fallback={<p>در حال آماده‌سازی JSON…</p>}><PostJson post={editor.post} /></Suspense>}
        </div>
      </section>
    </div>
    <ConfirmDialog open={editor.blocker.state === "blocked"} title="تغییرات ذخیره نشده‌اند" description="با خروج از این صفحه تغییرات از دست می‌روند." confirmLabel="خروج بدون ذخیره" onCancel={() => editor.blocker.reset?.()} onConfirm={() => editor.blocker.proceed?.()} />
  </div>;
}

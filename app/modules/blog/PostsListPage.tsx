import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Download, FileText, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ConfirmDialog } from "~/components/ConfirmDialog";
import type { BlogPost } from "./types";
import { postRepository } from "./services/postRepository";
import { downloadPost, formatPostDate } from "./utils";

const PAGE_SIZE = 10;
export default function PostsListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query);
  const [status, setStatus] = useState("all");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);
  useEffect(() => {
    const load = () => {
      try { setPosts(postRepository.list()); setError(""); }
      catch { setError("خواندن پست‌ها از حافظه‌ی مرورگر ممکن نشد. داده‌های ذخیره‌شده را بررسی کنید."); }
      finally { setLoading(false); }
    };
    load(); window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);
  const tags = useMemo(() => [...new Set(posts.flatMap((post) => post.tags))], [posts]);
  const filtered = useMemo(() => {
    const text = search.trim().toLocaleLowerCase("fa");
    return posts.filter((post) => (status === "all" || post.status === status) && (!tag || post.tags.includes(tag)) &&
      (!text || [post.title, post.author, ...post.tags].some((value) => value.toLocaleLowerCase("fa").includes(text))));
  }, [posts, search, status, tag]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const published = posts.filter((post) => post.status === "published").length;
  return <div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="mb-2 text-xs text-indigo-600">مدیریت محتوا</p><h1 className="text-2xl font-bold text-slate-900">پست‌های بلاگ</h1><p className="mt-2 text-sm text-slate-500">از یک ایده تا یک مطلب خواندنی؛ محتوای خود را اینجا مدیریت کنید.</p></div><Button asChild><Link to="/posts/new"><Plus size={17} />ساخت پست جدید</Link></Button></header>
    <div className="grid gap-4 sm:grid-cols-3">{[{ label: "همه پست‌ها", count: posts.length }, { label: "منتشرشده", count: published }, { label: "پیش‌نویس", count: posts.length - published }].map((stat) => <div key={stat.label} className="flex items-center justify-between rounded-2xl border bg-white p-5"><span className="text-sm text-slate-500">{stat.label}</span><strong className="text-2xl text-slate-900">{stat.count.toLocaleString("fa-IR")}</strong></div>)}</div>
    <section className="overflow-hidden rounded-2xl border bg-white">
      <div className="flex flex-wrap gap-3 border-b p-4">
        <div className="relative min-w-[200px] flex-1"><Search className="absolute right-3 top-3 text-slate-400" size={16} /><Input aria-label="جست‌وجوی پست‌ها" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} className="h-10 pr-9" placeholder="جست‌وجو در عنوان، نویسنده و تگ…" /></div>
        <select aria-label="فیلتر وضعیت" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm"><option value="all">همه وضعیت‌ها</option><option value="draft">پیش‌نویس</option><option value="published">منتشرشده</option></select>
        <select aria-label="فیلتر تگ" value={tag} onChange={(event) => { setTag(event.target.value); setPage(1); }} className="max-w-full rounded-lg border px-3 py-2 text-sm"><option value="">همه تگ‌ها</option>{tags.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </div>
      {error ? <p role="alert" className="p-8 text-center text-red-600">{error}</p> : loading ? <p role="status" className="p-12 text-center text-sm text-slate-500">در حال بارگذاری پست‌ها…</p> : !filtered.length ? <div className="p-12 text-center"><FileText className="mx-auto mb-4 text-indigo-300" size={44} strokeWidth={1} /><h2 className="font-bold">{posts.length ? "پستی با این مشخصات پیدا نشد" : "اولین داستان شما از اینجا شروع می‌شود"}</h2><p className="mb-6 mt-2 text-sm text-slate-500">{posts.length ? "عبارت جست‌وجو یا فیلترها را تغییر دهید." : "یک پست بسازید و محتوای آن را با بلوک‌ها بچینید."}</p>{!posts.length && <Button asChild><Link to="/posts/new"><Plus size={16} />ساخت اولین پست</Link></Button>}</div> : <>
        <div className="overflow-x-auto"><table className="w-full min-w-[660px] text-right text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{["عنوان پست", "نویسنده", "تاریخ انتشار", "وضعیت", "عملیات"].map((label) => <th key={label} className="px-5 py-4 font-medium">{label}</th>)}</tr></thead><tbody className="divide-y">{visible.map((post) => <tr key={post.id} className="hover:bg-slate-50/60"><td className="max-w-[340px] px-5 py-5"><Link to={`/posts/${post.id}/edit`} className="block truncate font-semibold text-slate-800 hover:text-indigo-600">{post.title}</Link><div className="mt-2 flex flex-wrap gap-1">{post.tags.slice(0, 3).map((item) => <span key={item} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">{item}</span>)}</div></td><td className="px-5 py-4 text-slate-500">{post.author || "—"}</td><td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{formatPostDate(post.publishedAt)}</td><td className="px-5 py-4"><span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${post.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{post.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span></td><td className="px-5 py-4"><div className="flex gap-1"><Button asChild variant="ghost" color="transparent" size="icon"><Link to={`/posts/${post.id}/edit`} aria-label={`ویرایش ${post.title}`} title="ویرایش"><Pencil size={16} /></Link></Button><Button variant="ghost" color="transparent" size="icon" aria-label={`دانلود JSON ${post.title}`} title="دانلود JSON" onClick={() => downloadPost(post)}><Download size={16} /></Button><Button variant="ghost" color="transparent" size="icon" className="text-red-500" aria-label={`حذف ${post.title}`} title="حذف" onClick={() => setDeleting(post)}><Trash2 size={16} /></Button></div></td></tr>)}</tbody></table></div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4 text-xs text-slate-500"><span>{filtered.length.toLocaleString("fa-IR")} پست • صفحه {currentPage.toLocaleString("fa-IR")} از {pages.toLocaleString("fa-IR")}</span><div className="flex gap-2"><Button variant="outline" color="transparent" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>قبلی</Button><Button variant="outline" color="transparent" size="sm" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>بعدی</Button></div></footer>
      </>}
    </section>
    <p className="text-xs leading-6 text-slate-400">ذخیره‌سازی فعلاً محلی است. برای انتقال محتوا به بک‌اند، خروجی JSON هر پست را دریافت کنید.</p>
    <ConfirmDialog open={!!deleting} title="حذف پست" description={`پست «${deleting?.title ?? ""}» حذف شود؟ این کار قابل بازگشت نیست.`} confirmLabel="حذف پست" destructive onCancel={() => setDeleting(null)} onConfirm={() => {
      if (!deleting) return;
      try { postRepository.remove(deleting.id); setPosts(postRepository.list()); setDeleting(null); toast.success("پست حذف شد."); }
      catch { toast.error("حذف پست انجام نشد."); }
    }} />
  </div>;
}

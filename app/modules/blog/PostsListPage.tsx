import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "~/components/ConfirmDialog";
import { PageHeader } from "~/components/layout/PageHeader";
import { EmptyState } from "~/components/ui/empty-state";
import type { BlogPost } from "./types";
import { postRepository } from "./services/postRepository";
import { usePosts } from "./hooks/usePosts";
import PostCard from "./components/PostCard";
import PostsFilters from "./components/PostsFilters";

const actionClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-xs text-white transition-colors hover:bg-stone-700";
export default function PostsListPage() {
  const data = usePosts();
  const [deleting, setDeleting] = useState<BlogPost | null>(null);
  const resetPage = () => data.setPage(1);
  return <div className="space-y-9">
    <PageHeader eyebrow="کتابخانه‌ی محتوا" title="مطالب شما" description="جایی برای ایده‌ها، داستان‌ها و هر چیزی که می‌خواهید به اشتراک بگذارید."
      actions={<Link to="/posts/new" className={actionClass}><Plus size={15} />مطلب جدید</Link>} />
    <PostsFilters query={data.query} onQuery={(value) => { data.setQuery(value); resetPage(); }}
      status={data.status} onStatus={(value) => { data.setStatus(value); resetPage(); }}
      tag={data.tag} tags={data.tags} onTag={(value) => { data.setTag(value); resetPage(); }}
      sort={data.sort} onSort={(value) => { data.setSort(value); resetPage(); }} counts={data.counts} />
    <section aria-label="کارت‌های مطالب" aria-busy={data.loading}>
      {data.error ? <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-xs leading-7 text-red-600">{data.error}</p> : data.loading ?
        <div role="status"><span className="sr-only">در حال بارگذاری مطالب…</span><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="overflow-hidden rounded-xl border border-stone-100 motion-safe:animate-pulse"><div className="aspect-[2.2/1] bg-stone-100" /><div className="space-y-4 p-5"><div className="h-3 w-1/4 rounded bg-stone-100" /><div className="h-4 w-3/4 rounded bg-stone-100" /><div className="h-3 w-full rounded bg-stone-50" /><div className="h-3 w-2/3 rounded bg-stone-50" /></div></div>)}</div></div> : !data.filtered.length ?
        <EmptyState icon={FileText} title={data.posts.length ? "مطلبی پیدا نشد" : "هر مطلب، با یک ایده شروع می‌شود"}
          description={data.posts.length ? "جست‌وجو یا فیلترها را تغییر دهید تا مطالب دیگر را ببینید." : "اولین مطلب را بسازید و کلمه‌ها، تصویرها و ایده‌هایتان را کنار هم بچینید."}
          action={data.posts.length ? <button type="button" className="text-xs text-stone-600 underline underline-offset-4" onClick={() => { data.setQuery(""); data.setTag(""); data.setStatus("all"); resetPage(); }}>نمایش همه‌ی مطالب</button> : <Link to="/posts/new" className={actionClass}><Plus size={15} />نوشتن اولین مطلب</Link>} /> :
        <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">{data.visible.map((post) => <PostCard key={post.id} post={post} onDelete={setDeleting} />)}</div>}
    </section>
    {!data.loading && !data.error && !!data.filtered.length && <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 pt-5 text-[11px] text-stone-400"><span>{data.filtered.length.toLocaleString("fa-IR")} مطلب<span className="mx-2">·</span>صفحه {data.currentPage.toLocaleString("fa-IR")} از {data.pages.toLocaleString("fa-IR")}</span><div className="flex gap-2"><button type="button" disabled={data.currentPage === 1} onClick={() => data.setPage(data.currentPage - 1)} className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-stone-600 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-30"><ArrowRight size={13} />قبلی</button><button type="button" disabled={data.currentPage === data.pages} onClick={() => data.setPage(data.currentPage + 1)} className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-stone-600 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-30">بعدی<ArrowLeft size={13} /></button></div></footer>}
    <ConfirmDialog open={!!deleting} title="حذف مطلب" description={`مطلب «${deleting?.title ?? ""}» حذف شود؟ این کار قابل بازگشت نیست.`} confirmLabel="حذف مطلب" destructive onCancel={() => setDeleting(null)} onConfirm={() => {
      if (!deleting) return;
      try { postRepository.remove(deleting.id); data.setPosts(postRepository.list()); setDeleting(null); toast.success("مطلب حذف شد."); }
      catch { toast.error("حذف مطلب انجام نشد."); }
    }} />
  </div>;
}

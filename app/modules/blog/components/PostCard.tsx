import { memo, useState } from "react";
import { Link } from "react-router";
import { ArrowUpLeft, Download, ImageIcon, Trash2 } from "lucide-react";
import { safeImage } from "../schema";
import { downloadPost, formatPostDate } from "../utils";
import type { BlogPost } from "../types";

function PostCover({ post, src }: { post: BlogPost; src?: string }) {
  const [failed, setFailed] = useState(false);
  return <div className="aspect-[2.2/1] overflow-hidden bg-stone-50">
    {src && !failed ? <img src={src} alt={post.cover.alt} style={{ objectPosition: post.cover.position ?? "center" }} loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover/card:scale-[1.025]" /> :
      <div className="flex h-full items-center justify-center text-stone-200"><ImageIcon size={35} strokeWidth={1} /></div>}
  </div>;
}

export default memo(function PostCard({ post, onDelete }: { post: BlogPost; onDelete: (post: BlogPost) => void }) {
  const editPath = `/posts/${post.id}/edit`;
  const src = safeImage(post.cover.src);
  return <article className="group/card flex min-w-0 flex-col overflow-hidden rounded-xl border border-stone-200/80 bg-white transition-[border-color,box-shadow] duration-200 hover:border-stone-300 hover:shadow-[0_6px_24px_-16px_rgba(0,0,0,0.18)]">
    <Link to={editPath} aria-label={`ویرایش ${post.title}`} className="relative block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stone-500">
      <PostCover key={src} src={src} post={post} />
      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-white/60 bg-white/95 px-2.5 py-1 text-[10px] text-stone-600 backdrop-blur-sm"><span aria-hidden="true" className={`size-1.5 rounded-full ${post.status === "published" ? "bg-emerald-500" : "bg-stone-300"}`} />{post.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span>
    </Link>
    <div className="flex flex-1 flex-col px-5 pb-4 pt-5">
      <div className="mb-3 flex min-h-5 flex-wrap gap-1.5">{post.tags.slice(0, 2).map((tag) => <span key={tag} className="max-w-36 truncate rounded bg-stone-50 px-2 py-0.5 text-[10px] text-stone-500">{tag}</span>)}{post.tags.length > 2 && <span className="py-0.5 text-[10px] text-stone-400">+{(post.tags.length - 2).toLocaleString("fa-IR")}</span>}</div>
      <h2 className="mb-2 text-[15px] font-semibold leading-7 text-stone-800"><Link to={editPath} className="line-clamp-2 hover:text-stone-500">{post.title || "مطلب بدون عنوان"}</Link></h2>
      <p className="mb-5 line-clamp-2 min-h-12 text-xs leading-6 text-stone-400">{post.excerpt || "هنوز خلاصه‌ای برای این مطلب نوشته نشده است."}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pb-4 text-[10px] text-stone-400"><span className="max-w-32 truncate">{post.author || "بدون نویسنده"}</span><span aria-hidden="true">·</span><time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time></div>
      <footer className="flex items-center justify-between border-t border-stone-100 pt-3">
        <Link to={editPath} className="inline-flex items-center gap-1.5 rounded py-1.5 text-[11px] text-stone-600 hover:text-stone-900">ویرایش مطلب<ArrowUpLeft size={13} /></Link>
        <div className="flex gap-1">
          <button type="button" aria-label={`دانلود JSON ${post.title}`} title="دانلود JSON" onClick={() => downloadPost(post)} className="rounded-md p-2 text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-800"><Download size={14} /></button>
          <button type="button" aria-label={`حذف ${post.title}`} title="حذف مطلب" onClick={() => onDelete(post)} className="rounded-md p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 size={14} /></button>
        </div>
      </footer>
    </div>
  </article>;
});

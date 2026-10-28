import { memo } from "react";
import { ImageIcon } from "lucide-react";
import type { BlogPost, ContentBlock } from "../types";
import { safeHref, safeImage } from "../schema";
import { formatPostDate } from "../utils";

const BlockPreview = memo(function BlockPreview({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading": {
      const Tag = block.level === 3 ? "h3" : "h2";
      return <Tag className={block.level === 3 ? "text-xl font-bold" : "text-2xl font-bold"}>{block.text || "عنوان بخش"}</Tag>;
    }
    case "paragraph": return <p className="whitespace-pre-wrap text-slate-600 leading-9">{block.text || "متن پاراگراف در این قسمت نمایش داده می‌شود…"}</p>;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return <Tag className={`space-y-2 pr-6 leading-8 text-slate-600 ${block.ordered ? "list-decimal" : "list-disc"}`}>{block.items.map((item, index) => <li key={index}>{item || "آیتم لیست"}</li>)}</Tag>;
    }
    case "link": return <a className="inline-flex rounded-lg bg-main px-5 py-3 text-sm text-white" href={safeHref(block.href)} target="_blank" rel="noopener noreferrer">{block.text || "متن لینک"}</a>;
    case "image": {
      const src = safeImage(block.image.src);
      const image = src ? <img src={src} alt={block.image.alt} className="w-full rounded-xl object-cover" loading="lazy" decoding="async" /> : <ImagePlaceholder />;
      return <figure>{safeHref(block.href) ? <a href={safeHref(block.href)} target="_blank" rel="noopener noreferrer">{image}</a> : image}
        {block.caption && <figcaption className="mt-3 text-center text-xs text-slate-500">{block.caption}</figcaption>}</figure>;
    }
  }
});
function ImagePlaceholder() {
  return <div className="flex aspect-[16/7] items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><ImageIcon size={40} strokeWidth={1} /></div>;
}
export default memo(function PostPreview({ post }: { post: BlogPost }) {
  const cover = safeImage(post.cover.src);
  return <article dir="rtl" className="mx-auto max-w-[740px] break-words px-2 py-4 sm:px-0">
    <div className="mb-7 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-[11px] text-stone-600">{tag}</span>)}</div>
    <h1 className="text-[30px] font-bold leading-[1.65] tracking-tight text-stone-900 sm:text-[40px]">{post.title || "عنوان داستان شما…"}</h1>
    <div className="mb-7 mt-4 flex flex-wrap gap-3 text-xs text-slate-500"><span>{formatPostDate(post.publishedAt)}</span><span>•</span><span>{post.author || "نام نویسنده"}</span></div>
    {cover ? <img src={cover} alt={post.cover.alt} className="mb-7 max-h-[520px] w-full rounded-lg object-cover" decoding="async" /> : <ImagePlaceholder />}
    {post.excerpt && <p className="my-7 text-[16px] leading-8 text-stone-500">{post.excerpt}</p>}
    <div className="mt-8 space-y-7">{post.blocks.map((block) => <BlockPreview key={block.id} block={block} />)}</div>
    {!post.blocks.length && <p className="py-12 text-center text-sm text-slate-400">محتوای پست پس از افزودن بلوک‌ها اینجا نمایش داده می‌شود.</p>}
  </article>;
});

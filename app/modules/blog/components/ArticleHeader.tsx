import { Tags } from "lucide-react";
import { InlineText } from "~/components/ui/inline-text";
import { TagInput } from "~/components/ui/tag-input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { EditorField } from "~/components/ui/editor-field";
import type { PostMetadataValue } from "../types";
import InlineImage from "./InlineImage";

export default function ArticleHeader({ value, onChange }: { value: PostMetadataValue; onChange: (patch: Partial<PostMetadataValue>) => void }) {
  return <header className="space-y-7">
    <div className="flex min-h-7 flex-wrap items-center gap-2">
      {value.tags.map((tag) => <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-[11px] text-stone-600">{tag}</span>)}
      <Popover><PopoverTrigger asChild><button type="button" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"><Tags size={13} />{value.tags.length ? "ویرایش تگ‌ها" : "افزودن تگ"}</button></PopoverTrigger>
        <PopoverContent dir="rtl" className="w-80"><EditorField label="تگ‌ها / دسته‌بندی">{(id) => <TagInput id={id} value={value.tags} onChange={(tags) => onChange({ tags })} />}</EditorField></PopoverContent>
      </Popover>
    </div>
    <InlineText aria-label="عنوان پست" value={value.title} onChange={(title) => onChange({ title })} placeholder="عنوان داستان شما…" className="text-[30px] font-bold leading-[1.65] tracking-tight text-stone-900 sm:text-[40px]" />
    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
      <input aria-label="تاریخ انتشار" type="date" value={value.publishedAt} onChange={(event) => onChange({ publishedAt: event.target.value })} className="min-w-0 rounded border-0 bg-transparent p-1 outline-none focus:bg-stone-100" />
      <span aria-hidden="true">/</span>
      <input aria-label="نام نویسنده" value={value.author} placeholder="نام نویسنده" onChange={(event) => onChange({ author: event.target.value })} className="w-36 max-w-full rounded border-0 bg-transparent p-1 text-stone-500 outline-none placeholder:text-stone-300 focus:bg-stone-100" />
    </div>
    <InlineImage cover value={value.cover} onChange={(cover) => onChange({ cover })} />
    <InlineText aria-label="توضیحات مختصر" value={value.excerpt} onChange={(excerpt) => onChange({ excerpt })} placeholder="در چند جمله، مقدمه‌ی این مطلب را بنویسید…" className="text-[16px] leading-8 text-stone-500" />
  </header>;
}

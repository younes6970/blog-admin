import { memo } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { EditorField } from "~/components/ui/editor-field";
import { ImageField } from "~/components/ui/image-field";
import { TagInput } from "~/components/ui/tag-input";
import type { BlogPost } from "../types";

export type PostMetadataValue = Omit<BlogPost, "blocks">;
export default memo(function PostMetadata({ value, onChange }: { value: PostMetadataValue; onChange: (patch: Partial<PostMetadataValue>) => void }) {
  return <section className="space-y-5 rounded-2xl border bg-white p-5">
    <div><h2 className="font-bold text-slate-900">اطلاعات پست</h2><p className="mt-1 text-xs text-slate-500">مشخصات اصلی و تصویر شاخص</p></div>
    <EditorField label="عنوان پست">{(id) => <Input id={id} value={value.title} onChange={(event) => onChange({ title: event.target.value })} placeholder="یک عنوان روشن و جذاب…" />}</EditorField>
    <EditorField label="توضیحات مختصر">{(id) => <Textarea id={id} rows={3} value={value.excerpt} onChange={(event) => onChange({ excerpt: event.target.value })} placeholder="این مطلب درباره‌ی چیست؟" />}</EditorField>
    <EditorField label="تگ‌ها / دسته‌بندی">{(id) => <TagInput id={id} value={value.tags} onChange={(tags) => onChange({ tags })} />}</EditorField>
    <div className="grid gap-4 sm:grid-cols-2">
      <EditorField label="نویسنده">{(id) => <Input id={id} value={value.author} onChange={(event) => onChange({ author: event.target.value })} />}</EditorField>
      <EditorField label="تاریخ انتشار">{(id) => <Input id={id} type="date" dir="ltr" value={value.publishedAt} onChange={(event) => onChange({ publishedAt: event.target.value })} />}</EditorField>
    </div>
    <EditorField label="وضعیت">{(id) => <select id={id} className="h-10 w-full rounded-lg border px-3 text-sm" value={value.status} onChange={(event) => onChange({ status: event.target.value as BlogPost["status"] })}><option value="draft">پیش‌نویس</option><option value="published">منتشرشده</option></select>}</EditorField>
    <div className="border-t pt-5"><h3 className="mb-3 text-sm font-semibold">تصویر اصلی</h3><ImageField value={value.cover} onChange={(cover) => onChange({ cover })} /></div>
  </section>;
});

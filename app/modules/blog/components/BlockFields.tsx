import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { EditorField } from "~/components/ui/editor-field";
import { ImageField } from "~/components/ui/image-field";
import { BANNER_SIZES, LIST_MARKERS, type BannerSize, type ListMarker, type ContentBlock } from "../types";
import { BANNER_SIZE_LABELS, LIST_MARKER_LABELS, getListMarker } from "../block-presentation";
import { LINK_VARIANTS, LINK_SIZES, type LinkVariant, type LinkSize } from "../types";

export default function BlockFields({ block, onChange }: { block: ContentBlock; onChange: (block: ContentBlock) => void }) {
  switch (block.type) {
    case "heading": return <div className="space-y-3">
      <EditorField label="متن عنوان">{(id) => <Input id={id} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} />}</EditorField>
      <EditorField label="سطح عنوان">{(id) => <select id={id} className="rounded-lg border p-2 text-sm" value={block.level} onChange={(event) => onChange({ ...block, level: Number(event.target.value) as 2 | 3 })}><option value={2}>عنوان بخش (H2)</option><option value={3}>زیرعنوان (H3)</option></select>}</EditorField>
    </div>;
    case "paragraph": return <EditorField label="متن پاراگراف">{(id) => <Textarea id={id} rows={5} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} placeholder="متن خود را بنویسید…" />}</EditorField>;
    case "list": return <div className="space-y-3">
      <EditorField label="آیتم‌های لیست" hint="هر آیتم را در یک خط جدا بنویسید.">{(id) => <Textarea id={id} rows={4} value={block.items.join("\n")} onChange={(event) => onChange({ ...block, items: event.target.value.split("\n") })} />}</EditorField>
      <EditorField label="علامت لیست">{(id) => <select id={id} className="w-full rounded-lg border p-2 text-sm" value={getListMarker(block)} onChange={(event) => onChange({ ...block, marker: event.target.value as ListMarker, ordered: event.target.value === "decimal" })}>{LIST_MARKERS.map((marker) => <option key={marker} value={marker}>{LIST_MARKER_LABELS[marker]}</option>)}</select>}</EditorField>
      <p className="text-xs leading-6 text-stone-400">در محیط مطلب، آیتم خالی را با Backspace یا Delete حذف کنید.</p>
    </div>;
    case "image": return <div className="space-y-4">
      <EditorField label="اندازه بنر" hint="در حالت عریض و باریک، تصویر برای پر کردن کادر برش می‌خورد.">{(id) => <select id={id} className="w-full rounded-lg border p-2 text-sm" value={block.size ?? "original"} onChange={(event) => onChange({ ...block, size: event.target.value as BannerSize })}>{BANNER_SIZES.map((size) => <option key={size} value={size}>{BANNER_SIZE_LABELS[size]}</option>)}</select>}</EditorField>
      <ImageField value={block.image} onChange={(image) => onChange({ ...block, image })} />
      <EditorField label="زیرنویس تصویر (اختیاری)">{(id) => <Input id={id} value={block.caption} onChange={(event) => onChange({ ...block, caption: event.target.value })} />}</EditorField>
      <EditorField label="لینک بنر (اختیاری)">{(id) => <Input id={id} dir="ltr" placeholder="https://…" value={block.href} onChange={(event) => onChange({ ...block, href: event.target.value })} />}</EditorField>
    </div>;
    case "link": return <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <EditorField label="ظاهر لینک">{(id) => <select id={id} className="w-full rounded-lg border p-2 text-sm" value={block.variant ?? "default"} onChange={(event) => onChange({ ...block, variant: event.target.value as LinkVariant })}>{LINK_VARIANTS.map((variant) => <option key={variant} value={variant}>{variant}</option>)}</select>}</EditorField>
        <EditorField label="اندازه لینک">{(id) => <select id={id} className="w-full rounded-lg border p-2 text-sm" value={block.size ?? "default"} onChange={(event) => onChange({ ...block, size: event.target.value as LinkSize })}>{LINK_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</select>}</EditorField>
      </div>
      <EditorField label="متن لینک">{(id) => <Input id={id} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} />}</EditorField>
      <EditorField label="آدرس لینک">{(id) => <Input id={id} dir="ltr" placeholder="https://…" value={block.href} onChange={(event) => onChange({ ...block, href: event.target.value })} />}</EditorField>
    </div>;
  }
}

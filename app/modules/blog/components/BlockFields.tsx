import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { EditorField } from "~/components/ui/editor-field";
import { ImageField } from "~/components/ui/image-field";
import type { ContentBlock } from "../types";

export default function BlockFields({ block, onChange }: { block: ContentBlock; onChange: (block: ContentBlock) => void }) {
  switch (block.type) {
    case "heading": return <div className="space-y-3">
      <EditorField label="متن عنوان">{(id) => <Input id={id} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} />}</EditorField>
      <EditorField label="سطح عنوان">{(id) => <select id={id} className="rounded-lg border p-2 text-sm" value={block.level} onChange={(event) => onChange({ ...block, level: Number(event.target.value) as 2 | 3 })}><option value={2}>عنوان بخش (H2)</option><option value={3}>زیرعنوان (H3)</option></select>}</EditorField>
    </div>;
    case "paragraph": return <EditorField label="متن پاراگراف">{(id) => <Textarea id={id} rows={5} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} placeholder="متن خود را بنویسید…" />}</EditorField>;
    case "list": return <div className="space-y-3">
      <EditorField label="آیتم‌های لیست" hint="هر آیتم را در یک خط جدا بنویسید.">{(id) => <Textarea id={id} rows={4} value={block.items.join("\n")} onChange={(event) => onChange({ ...block, items: event.target.value.split("\n") })} />}</EditorField>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={block.ordered} onChange={(event) => onChange({ ...block, ordered: event.target.checked })} />لیست شماره‌دار</label>
    </div>;
    case "image": return <div className="space-y-4">
      <ImageField value={block.image} onChange={(image) => onChange({ ...block, image })} />
      <EditorField label="زیرنویس تصویر (اختیاری)">{(id) => <Input id={id} value={block.caption} onChange={(event) => onChange({ ...block, caption: event.target.value })} />}</EditorField>
      <EditorField label="لینک بنر (اختیاری)">{(id) => <Input id={id} dir="ltr" placeholder="https://…" value={block.href} onChange={(event) => onChange({ ...block, href: event.target.value })} />}</EditorField>
    </div>;
    case "link": return <div className="space-y-3">
      <EditorField label="متن لینک">{(id) => <Input id={id} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} />}</EditorField>
      <EditorField label="آدرس لینک">{(id) => <Input id={id} dir="ltr" placeholder="https://…" value={block.href} onChange={(event) => onChange({ ...block, href: event.target.value })} />}</EditorField>
    </div>;
  }
}

import { InlineText } from "~/components/ui/inline-text";
import { Plus } from "lucide-react";
import type { ContentBlock } from "../types";
import InlineImage from "./InlineImage";

export default function InlineBlock({ block, onChange }: { block: ContentBlock; onChange: (block: ContentBlock) => void }) {
  switch (block.type) {
    case "heading": return <InlineText value={block.text} onChange={(text) => onChange({ ...block, text })} aria-label="عنوان بخش" placeholder="عنوان این بخش…" className={block.level === 2 ? "text-2xl font-bold leading-relaxed text-stone-900" : "text-xl font-semibold leading-relaxed text-stone-800"} />;
    case "paragraph": return <InlineText value={block.text} onChange={(text) => onChange({ ...block, text })} aria-label="پاراگراف" placeholder="از اینجا بنویسید…" className="text-[15px] leading-9 text-stone-600" />;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return <div><Tag className={`space-y-2 pr-5 text-stone-600 marker:text-stone-400 ${block.ordered ? "list-decimal" : "list-disc"}`}>
        {block.items.map((item, index) => <li key={index} className="pr-1"><InlineText aria-label={`آیتم ${index + 1} لیست`} value={item} placeholder="یک مورد بنویسید…" className="text-[15px] leading-8" onChange={(text) => onChange({ ...block, items: block.items.map((value, itemIndex) => itemIndex === index ? text : value) })} /></li>)}
      </Tag><button type="button" onClick={() => onChange({ ...block, items: [...block.items, ""] })} className="mt-2 inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-700"><Plus size={12} />افزودن مورد</button></div>;
    }
    case "image": return <figure className="space-y-3"><InlineImage value={block.image} onChange={(image) => onChange({ ...block, image })} /><InlineText aria-label="زیرنویس تصویر" placeholder="زیرنویس تصویر (اختیاری)" value={block.caption} onChange={(caption) => onChange({ ...block, caption })} className="text-center text-xs leading-6 text-stone-400" /></figure>;
    case "link": return <div className="inline-flex max-w-full min-w-40 rounded-lg border border-stone-200 px-5 py-3 text-stone-800"><InlineText aria-label="متن لینک" placeholder="متن لینک…" value={block.text} onChange={(text) => onChange({ ...block, text })} className="text-center text-sm leading-6" /></div>;
  }
}

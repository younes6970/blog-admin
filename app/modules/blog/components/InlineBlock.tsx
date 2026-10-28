import { InlineText } from "~/components/ui/inline-text";
import { ExternalLink } from "lucide-react";
import { safeHref } from "../schema";
import InlineList from "./InlineList";
import type { ContentBlock } from "../types";
import InlineImage from "./InlineImage";

export default function InlineBlock({ block, onChange }: { block: ContentBlock; onChange: (block: ContentBlock) => void }) {
  switch (block.type) {
    case "heading": return <InlineText value={block.text} onChange={(text) => onChange({ ...block, text })} aria-label="عنوان بخش" placeholder="عنوان این بخش…" className={block.level === 2 ? "text-2xl font-bold leading-relaxed text-stone-900" : "text-xl font-semibold leading-relaxed text-stone-800"} />;
    case "paragraph": return <InlineText value={block.text} onChange={(text) => onChange({ ...block, text })} aria-label="پاراگراف" placeholder="از اینجا بنویسید…" className="text-[15px] leading-9 text-stone-600" />;
    case "list": return <InlineList block={block} onChange={onChange} />;
    case "image": return <figure className="space-y-3"><InlineImage value={block.image} size={block.size} onChange={(image) => onChange({ ...block, image })} /><InlineText aria-label="زیرنویس تصویر" placeholder="زیرنویس تصویر (اختیاری)" value={block.caption} onChange={(caption) => onChange({ ...block, caption })} className="text-center text-xs leading-6 text-stone-400" />{safeHref(block.href) && <a href={safeHref(block.href)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-700"><ExternalLink size={12} />باز کردن لینک بنر</a>}</figure>;
    case "link": return <div className="inline-flex max-w-full min-w-40 rounded-lg border border-stone-200 px-5 py-3 text-stone-800"><InlineText aria-label="متن لینک" placeholder="متن لینک…" value={block.text} onChange={(text) => onChange({ ...block, text })} className="text-center text-sm leading-6" /></div>;
  }
}

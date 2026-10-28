import { useRef } from "react";
import { Plus, X } from "lucide-react";
import { InlineText } from "~/components/ui/inline-text";
import { getListMarker, listMarkerStyle } from "../block-presentation";
import type { ContentBlock } from "../types";
import { removeEmptyListItem } from "../list-editing";

type ListBlock = Extract<ContentBlock, { type: "list" }>;
export default function InlineList({ block, onChange }: { block: ListBlock; onChange: (block: ListBlock) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const marker = getListMarker(block);
  const Tag = marker === "decimal" ? "ol" : "ul";
  const focus = (index: number) => requestAnimationFrame(() => {
    const input = root.current?.querySelectorAll<HTMLTextAreaElement>("textarea")[index];
    if (input) { input.focus({ preventScroll: true }); input.setSelectionRange(input.value.length, input.value.length); }
    else addButton.current?.focus({ preventScroll: true });
  });
  const remove = (index: number) => {
    onChange({ ...block, items: block.items.filter((_, itemIndex) => itemIndex !== index) });
    focus(Math.max(0, index - 1));
  };
  return <div ref={root}>
    <Tag style={{ listStyleType: listMarkerStyle(marker) }} className={`space-y-2 text-stone-600 marker:text-stone-400 ${marker === "none" ? "pr-0" : "pr-5"}`}>
      {block.items.map((item, index) => <li key={index} className="group/item relative pr-1 pl-7">
        <InlineText aria-label={`آیتم ${index + 1} لیست`} value={item} placeholder="یک مورد بنویسید…" className="text-[15px] leading-8"
          onChange={(text) => onChange({ ...block, items: block.items.map((value, itemIndex) => itemIndex === index ? text : value) })}
          onKeyDown={(event) => {
            const result = removeEmptyListItem(block.items, index, event.key, event.nativeEvent.isComposing);
            if (result) {
              event.preventDefault();
              onChange({ ...block, items: result.items });
              focus(result.focusIndex);
            }
          }} />
        <button type="button" aria-label={`حذف آیتم ${index + 1}`} title="حذف آیتم" onClick={() => remove(index)} className="absolute left-0 top-1 rounded p-1 text-stone-300 opacity-0 hover:text-red-500 focus:opacity-100 group-hover/item:opacity-100 group-focus-within/item:opacity-100"><X size={13} /></button>
      </li>)}
    </Tag>
    <button ref={addButton} type="button" onClick={() => { onChange({ ...block, items: [...block.items, ""] }); focus(block.items.length); }} className="mt-2 inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-700"><Plus size={12} />افزودن مورد</button>
  </div>;
}

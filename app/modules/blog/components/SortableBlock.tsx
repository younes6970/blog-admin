import { memo, useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { ArrowDown, ArrowUp, Copy, GripVertical, Settings2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { BLOCK_LABELS, type ContentBlock } from "../types";
import BlockFields from "./BlockFields";
import InlineBlock from "./InlineBlock";

type Props = {
  block: ContentBlock; index: number; count: number; selected: boolean;
  onSelect: (id: string) => void; onChange: (block: ContentBlock) => void;
  onRemove: (id: string) => void; onDuplicate: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
};
const toolClass = "inline-flex size-7 items-center justify-center rounded text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 disabled:opacity-25";
export default memo(function SortableBlock({ block, index, count, selected, onSelect, onChange, onRemove, onDuplicate, onMove }: Props) {
  const [settings, setSettings] = useState(false);
  const { ref, handleRef, isDragging } = useSortable({ id: block.id, index, type: "content-block", accept: "content-block" });
  return <section ref={ref} data-block-id={block.id} onFocusCapture={() => onSelect(block.id)} onClick={() => onSelect(block.id)}
    className={`group/block relative -mx-3 rounded-lg px-3 py-3 ring-1 transition-[box-shadow] ${isDragging ? "z-20 bg-white shadow-lg ring-stone-300" : selected ? "ring-stone-200" : "ring-transparent hover:ring-stone-200"}`}>
    <div className={`absolute -top-8 left-0 z-10 flex items-center gap-0.5 rounded-lg border border-stone-200 bg-white p-1 shadow-sm transition-opacity group-hover/block:opacity-100 group-focus-within/block:opacity-100 ${selected ? "opacity-100" : "opacity-0 pointer-events-none group-hover/block:pointer-events-auto group-focus-within/block:pointer-events-auto"}`}>
      <button type="button" ref={handleRef} className={`${toolClass} touch-none cursor-grab`} aria-label="کشیدن و جابه‌جایی بلوک" title="جابه‌جایی"><GripVertical size={15} /></button>
      <span className="border-l px-2 text-[10px] text-stone-400">{BLOCK_LABELS[block.type]}</span>
      <button type="button" className={toolClass} title="تنظیمات بلوک" aria-label="تنظیمات بلوک" onClick={() => setSettings(true)}><Settings2 size={14} /></button>
      <button type="button" className={toolClass} title="انتقال به بالا" aria-label="انتقال به بالا" disabled={!index} onClick={() => onMove(block.id, -1)}><ArrowUp size={14} /></button>
      <button type="button" className={toolClass} title="انتقال به پایین" aria-label="انتقال به پایین" disabled={index === count - 1} onClick={() => onMove(block.id, 1)}><ArrowDown size={14} /></button>
      <button type="button" className={toolClass} title="تکثیر بلوک" aria-label="تکثیر بلوک" onClick={() => onDuplicate(block.id)}><Copy size={14} /></button>
      <button type="button" className={`${toolClass} hover:!text-red-500`} title="حذف بلوک" aria-label="حذف بلوک" onClick={() => onRemove(block.id)}><Trash2 size={14} /></button>
    </div>
    <InlineBlock block={block} onChange={onChange} />
    <Dialog open={settings} onOpenChange={setSettings}><DialogContent dir="rtl" className="max-h-[85vh] overflow-auto">
      <DialogTitle>تنظیمات {BLOCK_LABELS[block.type]}</DialogTitle>
      <DialogDescription>جزئیات این بخش از مطلب را تنظیم کنید.</DialogDescription>
      <BlockFields block={block} onChange={onChange} />
      <button type="button" onClick={() => setSettings(false)} className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">انجام شد</button>
    </DialogContent></Dialog>
  </section>;
});

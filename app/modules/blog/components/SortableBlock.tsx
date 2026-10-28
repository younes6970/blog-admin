import { memo } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { ArrowDown, ArrowUp, Copy, GripVertical, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { BLOCK_LABELS, type ContentBlock } from "../types";
import BlockFields from "./BlockFields";

type Props = {
  block: ContentBlock; index: number; count: number;
  onChange: (block: ContentBlock) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
};
export default memo(function SortableBlock({ block, index, count, onChange, onRemove, onDuplicate, onMove }: Props) {
  const { ref, handleRef, isDragging } = useSortable({ id: block.id, index });
  return <section ref={ref} className={`rounded-xl border bg-white transition-shadow ${isDragging ? "z-10 shadow-xl ring-2 ring-indigo-300" : "shadow-sm"}`}>
    <header className="flex flex-wrap items-center justify-between gap-2 border-b bg-slate-50/80 px-3 py-2">
      <div className="flex items-center gap-2">
        <button type="button" ref={handleRef} aria-label={`جابه‌جایی بلوک ${index + 1}`} title="برای جابه‌جایی بکشید یا از کلیدهای جهت استفاده کنید" className="touch-none cursor-grab rounded p-1 text-slate-400 focus-visible:ring-2"><GripVertical size={20} /></button>
        <span className="text-sm font-medium">{BLOCK_LABELS[block.type]}</span><span className="text-xs text-slate-400">{(index + 1).toLocaleString("fa-IR")}</span>
      </div>
      <div className="flex gap-1">
        <Button type="button" variant="ghost" color="transparent" size="sm" aria-label="انتقال به بالا" title="انتقال به بالا" disabled={index === 0} onClick={() => onMove(block.id, -1)}><ArrowUp size={15} /></Button>
        <Button type="button" variant="ghost" color="transparent" size="sm" aria-label="انتقال به پایین" title="انتقال به پایین" disabled={index === count - 1} onClick={() => onMove(block.id, 1)}><ArrowDown size={15} /></Button>
        <Button type="button" variant="ghost" color="transparent" size="sm" aria-label="تکثیر بلوک" title="تکثیر بلوک" onClick={() => onDuplicate(block.id)}><Copy size={15} /></Button>
        <Button type="button" variant="ghost" color="transparent" size="sm" className="text-red-500" aria-label="حذف بلوک" title="حذف بلوک" onClick={() => onRemove(block.id)}><Trash2 size={15} /></Button>
      </div>
    </header>
    <div className="p-4"><BlockFields block={block} onChange={onChange} /></div>
  </section>;
});

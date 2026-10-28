import { useCallback } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { Heading, AlignRight, List, ImagePlus, Link2, Plus } from "lucide-react";
import { BLOCK_LABELS, createBlock, type BlockType, type ContentBlock } from "../types";
import SortableBlock from "./SortableBlock";

const TOOLS = [
  { type: "heading", icon: Heading }, { type: "paragraph", icon: AlignRight },
  { type: "list", icon: List }, { type: "image", icon: ImagePlus }, { type: "link", icon: Link2 },
] as const;
type Props = { blocks: ContentBlock[]; onChange: React.Dispatch<React.SetStateAction<ContentBlock[]>> };
export default function ContentBuilder({ blocks, onChange }: Props) {
  const update = useCallback((block: ContentBlock) => onChange((current) => current.map((item) => item.id === block.id ? block : item)), [onChange]);
  const remove = useCallback((id: string) => onChange((current) => current.filter((item) => item.id !== id)), [onChange]);
  const duplicate = useCallback((id: string) => onChange((current) => {
    const index = current.findIndex((item) => item.id === id);
    if (index < 0) return current;
    const copy = { ...structuredClone(current[index]), id: crypto.randomUUID() };
    return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)];
  }), [onChange]);
  const shift = useCallback((id: string, direction: -1 | 1) => onChange((current) => {
    const index = current.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= current.length) return current;
    const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next;
  }), [onChange]);
  const add = (type: BlockType) => onChange((current) => [...current, createBlock(type)]);
  return <section className="space-y-4">
    <div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-900">محتوای پست</h2><p className="mt-1 text-xs leading-6 text-slate-500">بلوک‌ها را اضافه کنید و با کشیدن دستگیره مرتب کنید.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{blocks.length.toLocaleString("fa-IR")} بلوک</span></div>
    <div className="flex flex-wrap gap-2 rounded-xl border bg-white p-3">{TOOLS.map(({ type, icon: Icon }) => <button key={type} type="button" onClick={() => add(type)} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"><Icon size={16} />{BLOCK_LABELS[type]}<Plus size={12} /></button>)}</div>
    <DragDropProvider onDragEnd={(event) => { if (!event.canceled) onChange((current) => move(current, event)); }}>
      <div className="space-y-4">{blocks.map((block, index) => <SortableBlock key={block.id} block={block} index={index} count={blocks.length} onChange={update} onRemove={remove} onDuplicate={duplicate} onMove={shift} />)}</div>
    </DragDropProvider>
    {!blocks.length && <div className="rounded-xl border-2 border-dashed bg-white p-10 text-center"><div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500"><Plus /></div><h3 className="text-sm font-medium">اولین بلوک را اضافه کنید</h3><p className="mt-2 text-xs leading-6 text-slate-500">یک عنوان، متن، لیست، تصویر یا لینک؛ داستان پست را خودتان بچینید.</p></div>}
  </section>;
}

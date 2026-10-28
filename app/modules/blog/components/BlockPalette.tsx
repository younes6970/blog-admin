import { useDraggable } from "@dnd-kit/react";
import { AlignRight, Heading, ImagePlus, Link2, List, Plus } from "lucide-react";
import { BLOCK_LABELS, type BlockType } from "../types";

const TOOLS = [
  { type: "heading", icon: Heading, hint: "یک بخش جدید" }, { type: "paragraph", icon: AlignRight, hint: "متن و داستان" },
  { type: "list", icon: List, hint: "مرتب و خوانا" }, { type: "image", icon: ImagePlus, hint: "تصویر یا بنر" }, { type: "link", icon: Link2, hint: "لینک و فراخوان" },
] as const;
function PaletteItem({ tool, onAdd }: { tool: typeof TOOLS[number]; onAdd: (type: BlockType) => void }) {
  const { ref, isDragging } = useDraggable({ id: `palette-${tool.type}`, type: "palette", data: { blockType: tool.type } });
  const Icon = tool.icon;
  return <button ref={ref} type="button" onClick={() => onAdd(tool.type)} title={`${BLOCK_LABELS[tool.type]}؛ بکشید یا کلیک کنید`}
    className={`flex touch-none items-center gap-3 rounded-lg px-3 py-3 text-right transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-stone-300 md:w-full ${isDragging ? "opacity-40" : ""}`}>
    <Icon size={19} strokeWidth={1.5} className="shrink-0 text-stone-500" />
    <span className="hidden md:block"><span className="block text-xs text-stone-700">{BLOCK_LABELS[tool.type]}</span><span className="mt-1 block text-[10px] text-stone-400">{tool.hint}</span></span>
  </button>;
}
export default function BlockPalette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return <aside aria-label="ابزار افزودن بلوک" className="order-1 sticky top-[73px] z-30 self-start rounded-xl border border-stone-200/70 bg-[#fafaf9]/95 p-1 backdrop-blur-sm md:order-none md:top-28 md:w-44 md:border-0 md:p-0">
    <div className="mb-5 hidden items-center gap-2 px-3 text-[11px] text-stone-400 md:flex"><Plus size={13} />افزودن به مطلب</div>
    <div className="flex justify-center gap-1 md:flex-col">{TOOLS.map((tool) => <PaletteItem key={tool.type} tool={tool} onAdd={onAdd} />)}</div>
    <p className="mt-6 hidden px-3 text-[10px] leading-6 text-stone-400 md:block">یک بلوک را بکشید و بین بخش‌های مطلب رها کنید.<br />یا برای افزودن، روی آن کلیک کنید.</p>
  </aside>;
}

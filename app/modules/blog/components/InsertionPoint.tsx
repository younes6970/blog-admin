import { useDroppable } from "@dnd-kit/react";
import { Plus } from "lucide-react";

export default function InsertionPoint({ id, index, active, empty = false, onInsert }: { id: string; index: number; active: boolean; empty?: boolean; onInsert: () => void }) {
  // Identity belongs to the gap, not its changing array position. Keep targets
  // registered between drags; accept filters out existing sortable blocks.
  const { ref, isDropTarget } = useDroppable({ id, accept: "palette", data: { insertionIndex: index } });
  return <div ref={ref} data-insertion-id={id} data-insertion-index={index} className={`group/insert relative flex items-center justify-center transition-[height] ${empty ? "h-40" : active ? "h-14" : "h-9"}`}>
    <div className={`absolute inset-x-0 h-px transition-colors ${isDropTarget ? "bg-stone-800" : active ? "bg-stone-200" : "bg-transparent group-hover/insert:bg-stone-200"}`} />
    {active ? <span className={`relative rounded-full px-3 py-1 text-[10px] ${isDropTarget ? "bg-stone-800 text-white" : "bg-white text-stone-400"}`}>{isDropTarget ? "اینجا رها کنید" : "محل درج بلوک"}</span> : empty ?
      <button type="button" onClick={onInsert} className="relative w-full rounded-lg border border-dashed border-stone-200 bg-white py-10 text-center text-sm leading-8 text-stone-400 hover:border-stone-300 hover:text-stone-600">داستان را از اینجا شروع کنید…<span className="block text-[11px]">بنویسید، یا یک بلوک از ابزارها به این قسمت بکشید.</span></button> :
      <button type="button" aria-label={`افزودن پاراگراف در جایگاه ${index + 1}`} title="افزودن پاراگراف در این قسمت" onClick={onInsert} className="relative rounded-full border border-stone-200 bg-white p-1 text-stone-400 opacity-0 transition-opacity hover:text-stone-800 focus:opacity-100 group-hover/insert:opacity-100"><Plus size={12} /></button>}
  </div>;
}

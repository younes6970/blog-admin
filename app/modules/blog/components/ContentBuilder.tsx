import { Fragment, useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { BLOCK_LABELS, createBlock, type BlockType, type ContentBlock } from "../types";
import type { PostMetadataValue } from "../types";
import SortableBlock from "./SortableBlock";
import ArticleHeader from "./ArticleHeader";
import BlockPalette from "./BlockPalette";
import InsertionPoint from "./InsertionPoint";

type Props = {
  metadata: PostMetadataValue;
  onMetadataChange: (patch: Partial<PostMetadataValue>) => void;
  blocks: ContentBlock[];
  onChange: Dispatch<SetStateAction<ContentBlock[]>>;
};
export default function ContentBuilder({ metadata, onMetadataChange, blocks, onChange }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [paletteDragging, setPaletteDragging] = useState(false);
  const update = useCallback((block: ContentBlock) => onChange((current) => current.map((item) => item.id === block.id ? block : item)), [onChange]);
  const remove = useCallback((id: string) => { onChange((current) => current.filter((item) => item.id !== id)); setSelected(null); }, [onChange]);
  const duplicate = useCallback((id: string) => onChange((current) => {
    const index = current.findIndex((item) => item.id === id);
    if (index < 0) return current;
    return [...current.slice(0, index + 1), { ...structuredClone(current[index]), id: crypto.randomUUID() }, ...current.slice(index + 1)];
  }), [onChange]);
  const shift = useCallback((id: string, direction: -1 | 1) => onChange((current) => {
    const index = current.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= current.length) return current;
    const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next;
  }), [onChange]);
  const add = (type: BlockType, index = blocks.length) => {
    const block = createBlock(type);
    onChange((current) => [...current.slice(0, index), block, ...current.slice(index)]);
    setSelected(block.id);
    requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(`[data-block-id="${block.id}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      element?.querySelector<HTMLTextAreaElement>("textarea")?.focus({ preventScroll: true });
    });
  };
  return <DragDropProvider onDragStart={(event) => setPaletteDragging(event.operation.source?.type === "palette")}
    onDragEnd={(event) => {
      setPaletteDragging(false);
      if (event.canceled) return;
      const { source, target } = event.operation;
      if (source?.type === "palette") {
        const type = source.data.blockType as BlockType;
        const index = target?.data.insertionIndex;
        if (typeof index === "number" && type in BLOCK_LABELS) add(type, index);
      } else if (target) onChange((current) => move(current, event));
    }}>
    <div className="mx-auto grid max-w-[1130px] items-start gap-6 px-5 pb-32 pt-7 md:grid-cols-[minmax(0,1fr)_176px] md:gap-14 md:px-10 md:pt-14 lg:gap-20">
      <div className="order-2 min-w-0 md:order-none">
        <article aria-label="مطلب قابل ویرایش" className="mx-auto max-w-[740px] pt-4" onKeyDown={(event) => { if (event.key === "Escape") setSelected(null); }}>
          <div onFocusCapture={() => setSelected(null)}><ArticleHeader value={metadata} onChange={onMetadataChange} /></div>
          <div className="mt-6">
            {blocks.map((block, index) => <Fragment key={block.id}>
              <InsertionPoint index={index} active={paletteDragging} onInsert={() => add("paragraph", index)} />
              <SortableBlock block={block} index={index} count={blocks.length} selected={selected === block.id} onSelect={setSelected} onChange={update} onRemove={remove} onDuplicate={duplicate} onMove={shift} />
            </Fragment>)}
            <InsertionPoint index={blocks.length} active={paletteDragging} empty={!blocks.length} onInsert={() => add("paragraph")} />
          </div>
        </article>
        <footer className="mx-auto mt-14 max-w-[740px] border-t border-stone-200/60 pt-5 text-[10px] text-stone-400">{blocks.length.toLocaleString("fa-IR")} بلوک · ذخیره در این مرورگر</footer>
      </div>
      <BlockPalette onAdd={add} />
    </div>
    <DragOverlay disabled={(source) => source?.type !== "palette"} dropAnimation={null}>{(source) => <div className="rounded-lg border border-stone-200 bg-white px-5 py-3 text-xs text-stone-700 shadow-lg">{BLOCK_LABELS[source.data.blockType as BlockType] ?? "بلوک"}</div>}</DragOverlay>
  </DragDropProvider>;
}

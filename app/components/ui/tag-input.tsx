import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "./input";

export function TagInput({ id, value, onChange }: { id: string; value: string[]; onChange: (tags: string[]) => void }) {
  const [text, setText] = useState("");
  const add = () => {
    const next = text.split(/[,،]/).map((item) => item.trim()).filter(Boolean);
    if (next.length) onChange([...new Set([...value, ...next])]);
    setText("");
  };
  return <div className="space-y-2">
    <div className="flex gap-2">
      <Input id={id} value={text} placeholder="مثلاً طراحی، آموزش" onChange={(event) => setText(event.target.value)}
        onBlur={add} onKeyDown={(event) => { if (event.key === "Enter" || event.key === "," || event.key === "،") { event.preventDefault(); add(); } }} />
      <button type="button" onClick={add} className="rounded-lg border px-3 text-sm">افزودن</button>
    </div>
    <div className="flex flex-wrap gap-2">{value.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700">
      {tag}<button type="button" aria-label={`حذف تگ ${tag}`} onClick={() => onChange(value.filter((item) => item !== tag))}><X size={13} /></button>
    </span>)}</div>
  </div>;
}

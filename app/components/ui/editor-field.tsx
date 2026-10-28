import { useId, type ReactNode } from "react";

export function EditorField({ label, children, hint }: {
  label: string; hint?: string; children: (id: string) => ReactNode;
}) {
  const id = useId();
  return <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
    {children(id)}
    {hint && <p className="text-xs leading-5 text-slate-500">{hint}</p>}
  </div>;
}

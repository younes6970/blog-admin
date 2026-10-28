import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon; title: string; description: string; action?: ReactNode;
}) {
  return <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 px-5 py-16 text-center">
    <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-stone-50 text-stone-400"><Icon size={25} strokeWidth={1.2} /></div>
    <h2 className="text-base font-medium text-stone-800">{title}</h2>
    <p className="mt-3 max-w-sm text-xs leading-7 text-stone-400">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>;
}

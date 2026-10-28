import type { ReactNode } from "react";

export function PageHeader({ title, description, eyebrow, actions }: {
  title: string; description?: string; eyebrow?: string; actions?: ReactNode;
}) {
  return <header className="flex flex-wrap items-end justify-between gap-5">
    <div>
      {eyebrow && <p className="mb-3 text-[11px] text-stone-400">{eyebrow}</p>}
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-[28px]">{title}</h1>
      {description && <p className="mt-3 max-w-xl text-xs leading-7 text-stone-500">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </header>;
}

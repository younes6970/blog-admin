import { useLayoutEffect, useRef, type ComponentProps } from "react";
import { cn } from "~/lib/utils";

type Props = Omit<ComponentProps<"textarea">, "onChange" | "value"> & { value: string; onChange: (value: string) => void };

/** Plain text editing preserves the caret and never renders user HTML. */
export function InlineText({ value, onChange, className, ...props }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const resize = () => {
      element.style.height = "0px";
      element.style.height = `${element.scrollHeight}px`;
    };
    resize();
    let width = element.clientWidth;
    const observer = new ResizeObserver(() => {
      if (width !== element.clientWidth) { width = element.clientWidth; resize(); }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);
  return <textarea ref={ref} rows={1} value={value} onChange={(event) => onChange(event.target.value)}
    className={cn("block w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-inherit outline-none placeholder:text-stone-300 focus:ring-0", className)} {...props} />;
}

import { useState } from "react";
import { ImagePlus, Pencil } from "lucide-react";
import { ImageField } from "~/components/ui/image-field";
import { Dialog } from "~/components/ui/dialog";
import { ModalContent } from "~/components/ui/modal";
import { safeImage } from "../schema";
import type { BannerSize, ImageValue } from "../types";
import { bannerImageClass, bannerPlaceholderClass, COVER_IMAGE_CLASS } from "../block-presentation";

export default function InlineImage({ value, onChange, cover = false, size }: { value: ImageValue; onChange: (value: ImageValue) => void; cover?: boolean; size?: BannerSize }) {
  const [open, setOpen] = useState(false);
  const src = safeImage(value.src);
  return <>
    <button type="button" onClick={() => setOpen(true)} aria-label={cover ? "ویرایش تصویر اصلی" : "ویرایش تصویر بنر"}
      className="group/image relative block w-full overflow-hidden rounded-lg text-stone-400 outline-none focus-visible:ring-2 focus-visible:ring-stone-400">
      {src ? <img src={src} alt={value.alt} decoding="async" loading={cover ? "eager" : "lazy"} style={{ objectPosition: value.position ?? "center" }} className={cover ? COVER_IMAGE_CLASS : bannerImageClass(size)} /> :
        <span className={`flex flex-col items-center justify-center gap-3 bg-stone-100/70 transition-colors hover:bg-stone-100 ${cover ? "aspect-[2.2/1]" : bannerPlaceholderClass(size)}`}>
          <ImagePlus size={25} strokeWidth={1.3} /><span className="text-xs">{cover ? "افزودن تصویر اصلی" : "یک تصویر برای این بخش انتخاب کنید"}</span>
        </span>}
      {src && <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-xs text-stone-600 opacity-0 shadow-sm transition-opacity group-hover/image:opacity-100 group-focus-visible/image:opacity-100"><Pencil size={12} />تغییر تصویر</span>}
    </button>
    <Dialog open={open} onOpenChange={setOpen}><ModalContent title={cover ? "تصویر اصلی مطلب" : "تصویر بنر"} description="تصویر را از دستگاه یا با آدرس اینترنتی انتخاب کنید."
      footer={<button type="button" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white" onClick={() => setOpen(false)}>انجام شد</button>}>
      <div className="space-y-5">
      {cover && src && <img src={src} alt={value.alt} decoding="async" className={`rounded-lg ${COVER_IMAGE_CLASS}`} style={{ objectPosition: value.position ?? "center" }} />}
      <ImageField value={value} onChange={onChange} allowPosition={cover} />
      </div>
    </ModalContent></Dialog>
  </>;
}

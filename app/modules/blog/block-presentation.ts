import type { BannerSize, ContentBlock, ListMarker, LinkVariant, LinkSize } from "./types";
export const COVER_IMAGE_CLASS = "aspect-[2.2/1] w-full object-cover";

export const LIST_MARKER_LABELS: Record<ListMarker, string> = {
  decimal: "۱، ۲، ۳ — شماره‌دار", none: "بدون علامت", disc: "● دایره توپر",
  circle: "○ دایره توخالی", square: "■ مربع", diamond: "◆ لوزی",
};
export const BANNER_SIZE_LABELS: Record<BannerSize, string> = {
  original: "استاندارد — اندازه‌ی اصلی تصویر", wide: "عریض — نسبت ۵ به ۲", slim: "باریک — نسبت ۵ به ۱",
};
export function getListMarker(block: Extract<ContentBlock, { type: "list" }>): ListMarker {
  return block.marker ?? (block.ordered ? "decimal" : "disc");
}
export function listMarkerStyle(marker: ListMarker): string {
  return marker === "diamond" ? '"◆  "' : marker;
}
export function bannerImageClass(size: BannerSize = "original"): string {
  switch (size) {
    case "wide": return "aspect-[5/2] w-full object-cover";
    case "slim": return "aspect-[5/1] w-full object-cover";
    default: return "max-h-[520px] w-full object-cover";
  }
}
export function bannerPlaceholderClass(size: BannerSize = "original"): string {
  return size === "slim" ? "aspect-[5/1]" : "aspect-[5/2]";
}

const LINK_VARIANT_CLASSES: Record<LinkVariant, string> = {
  default: "border-stone-900 bg-stone-900 text-white hover:bg-stone-700",
  outline: "border-stone-300 bg-transparent text-stone-800 hover:bg-stone-50",
  ghost: "border-transparent bg-transparent text-stone-800 hover:bg-stone-100",
};
const LINK_SIZE_CLASSES: Record<LinkSize, string> = {
  sm: "min-h-8 px-3 py-1 text-xs",
  default: "min-h-10 px-5 py-2 text-sm",
  lg: "min-h-12 px-7 py-3 text-base",
};
export function linkAppearanceClass(variant: LinkVariant = "default", size: LinkSize = "default"): string {
  return `inline-flex max-w-full items-center justify-center rounded-lg border text-center leading-6 transition-colors ${LINK_VARIANT_CLASSES[variant]} ${LINK_SIZE_CLASSES[size]}`;
}

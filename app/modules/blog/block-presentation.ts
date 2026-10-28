import type { BannerSize, ContentBlock, ListMarker } from "./types";

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

export const IMAGE_POSITIONS = ["top left", "top", "top right", "left", "center", "right", "bottom left", "bottom", "bottom right"] as const;
export type ImagePosition = typeof IMAGE_POSITIONS[number];
export type ImageValue = { src: string; alt: string; position?: ImagePosition };

export const IMAGE_POSITION_LABELS: Record<ImagePosition, string> = {
  "top left": "بالا چپ", top: "بالا", "top right": "بالا راست",
  left: "چپ", center: "وسط", right: "راست",
  "bottom left": "پایین چپ", bottom: "پایین", "bottom right": "پایین راست",
};

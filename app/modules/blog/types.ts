import type { ImageValue } from "../../types/image";
export type { ImageValue } from "../../types/image";
export const LIST_MARKERS = ["decimal", "none", "disc", "circle", "square", "diamond"] as const;
export type ListMarker = typeof LIST_MARKERS[number];
export const BANNER_SIZES = ["original", "wide", "slim"] as const;
export type BannerSize = typeof BANNER_SIZES[number];
export const LINK_VARIANTS = ["default", "outline", "ghost"] as const;
export type LinkVariant = typeof LINK_VARIANTS[number];
export const LINK_SIZES = ["sm", "default", "lg"] as const;
export type LinkSize = typeof LINK_SIZES[number];
type BlockBase = { id: string };
export type ContentBlock =
  | (BlockBase & { type: "heading"; text: string; level: 2 | 3 })
  | (BlockBase & { type: "paragraph"; text: string })
  | (BlockBase & { type: "list"; items: string[]; ordered: boolean; marker?: ListMarker })
  | (BlockBase & { type: "image"; image: ImageValue; caption: string; href: string; size?: BannerSize })
  | (BlockBase & { type: "link"; text: string; href: string; variant?: LinkVariant; size?: LinkSize });
export type BlockType = ContentBlock["type"];
export type BlogPost = {
  schemaVersion: 1;
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  author: string;
  publishedAt: string;
  cover: ImageValue;
  status: "draft" | "published";
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
};
export type PostMetadataValue = Omit<BlogPost, "blocks">;

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "عنوان", paragraph: "پاراگراف", list: "لیست", image: "بنر تصویر", link: "لینک",
};

export function createBlock(type: BlockType): ContentBlock {
  const id = crypto.randomUUID();
  switch (type) {
    case "heading": return { id, type, text: "", level: 2 };
    case "paragraph": return { id, type, text: "" };
    case "list": return { id, type, items: [""], ordered: false };
    case "image": return { id, type, image: { src: "", alt: "" }, caption: "", href: "" };
    case "link": return { id, type, text: "", href: "", variant: "default", size: "default" };
  }
}

export function createPost(): BlogPost {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1, id: crypto.randomUUID(), title: "", excerpt: "", tags: [],
    author: "", publishedAt: now.slice(0, 10), cover: { src: "", alt: "" },
    status: "draft", blocks: [], createdAt: now, updatedAt: now,
  };
}

export type ImageValue = { src: string; alt: string };
type BlockBase = { id: string };
export type ContentBlock =
  | (BlockBase & { type: "heading"; text: string; level: 2 | 3 })
  | (BlockBase & { type: "paragraph"; text: string })
  | (BlockBase & { type: "list"; items: string[]; ordered: boolean })
  | (BlockBase & { type: "image"; image: ImageValue; caption: string; href: string })
  | (BlockBase & { type: "link"; text: string; href: string });
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
    case "link": return { id, type, text: "", href: "" };
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

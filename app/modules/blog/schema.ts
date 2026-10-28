import { z } from "zod";
import { BANNER_SIZES, LIST_MARKERS } from "./types";

export function safeHref(value: string): string | undefined {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}
export function safeImage(value: string): string | undefined {
  if (/^data:image\/(png|jpeg|webp|gif);base64,[a-z\d+/=\s]+$/i.test(value)) return value;
  return safeHref(value);
}
const image = z.object({ src: z.string(), alt: z.string() });
const base = { id: z.string().min(1) };
export const postSchema = z.object({
  schemaVersion: z.literal(1), id: z.string().min(1), title: z.string(), excerpt: z.string(),
  tags: z.array(z.string()), author: z.string(), publishedAt: z.string(), cover: image,
  status: z.enum(["draft", "published"]), createdAt: z.string(), updatedAt: z.string(),
  blocks: z.array(z.discriminatedUnion("type", [
    z.object({ ...base, type: z.literal("heading"), text: z.string(), level: z.union([z.literal(2), z.literal(3)]) }),
    z.object({ ...base, type: z.literal("paragraph"), text: z.string() }),
    z.object({ ...base, type: z.literal("list"), items: z.array(z.string()), ordered: z.boolean(), marker: z.enum(LIST_MARKERS).optional() }),
    z.object({ ...base, type: z.literal("image"), image, caption: z.string(), href: z.string(), size: z.enum(BANNER_SIZES).optional() }),
    z.object({ ...base, type: z.literal("link"), text: z.string(), href: z.string() }),
  ])),
}).refine((post) => new Set(post.blocks.map((block) => block.id)).size === post.blocks.length,
  "شناسه‌های بلوک باید یکتا باشند");

export function validatePost(post: z.infer<typeof postSchema>): string | undefined {
  if (!post.title.trim()) return "عنوان پست را وارد کنید.";
  if (post.cover.src && !safeImage(post.cover.src)) return "آدرس تصویر اصلی معتبر نیست.";
  for (const block of post.blocks) {
    if (block.type === "link" && !safeHref(block.href)) return "برای بلوک لینک، آدرس کامل http یا https وارد کنید.";
    if (block.type === "image" && (!safeImage(block.image.src) || (block.href && !safeHref(block.href)))) {
      return "تصویر یا لینک یکی از بنرها معتبر نیست.";
    }
  }
  if (post.status === "published") {
    if (!post.excerpt.trim() || !post.author.trim() || !post.cover.src || !post.cover.alt.trim() || !post.tags.length || !post.publishedAt) {
      return "برای انتشار، خلاصه، نویسنده، تاریخ، تصویر اصلی، متن جایگزین و حداقل یک تگ را تکمیل کنید.";
    }
    if (!post.blocks.length) return "برای انتشار حداقل یک بلوک محتوا اضافه کنید.";
    if (post.blocks.some((block) => {
      switch (block.type) {
        case "heading": case "paragraph": return !block.text.trim();
        case "list": return !block.items.length || block.items.some((item) => !item.trim());
        case "link": return !block.text.trim();
        case "image": return !block.image.alt.trim();
      }
    })) return "بلوک‌های خالی و متن جایگزین تصاویر را تکمیل کنید.";
  }
}

import type { BlogPost } from "./types";

export function formatPostDate(value: string): string {
  if (!value) return "تاریخ انتشار";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "تاریخ نامعتبر" : date.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
}
export function serializePost(post: BlogPost): string {
  return JSON.stringify(post, null, 2);
}
export function downloadPost(post: BlogPost) {
  const url = URL.createObjectURL(new Blob([serializePost(post)], { type: "application/json;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `post-${post.id}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

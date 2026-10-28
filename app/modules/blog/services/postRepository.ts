import { z } from "zod";
import { postSchema } from "../schema";
import type { BlogPost } from "../types";

// Local adapter. Replace these methods with API calls when the backend is ready.
const STORAGE_KEY = "blog-admin.posts.v1";
export const postRepository = {
  list(): BlogPost[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const result = z.array(postSchema).safeParse(JSON.parse(raw));
    if (!result.success) throw new Error("داده‌های ذخیره‌شده معتبر نیستند؛ برای جلوگیری از حذف اطلاعات، ذخیره‌سازی متوقف شد.");
    return result.data.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  save(post: BlogPost): BlogPost {
    const parsed = postSchema.parse({ ...post, updatedAt: new Date().toISOString() });
    const posts = this.list();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([parsed, ...posts.filter((item) => item.id !== post.id)]));
    return parsed;
  },
  remove(id: string) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list().filter((post) => post.id !== id)));
  },
};

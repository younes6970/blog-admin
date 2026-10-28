import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { BlogPost } from "../types";
import { postRepository } from "../services/postRepository";

export type PostStatusFilter = "all" | "draft" | "published";
export type PostSort = "newest" | "oldest" | "title";
const PAGE_SIZE = 9;

export function usePosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query);
  const [status, setStatus] = useState<PostStatusFilter>("all");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<PostSort>("newest");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const load = () => {
      try { setPosts(postRepository.list()); setError(""); }
      catch { setError("خواندن پست‌ها از حافظه‌ی مرورگر ممکن نشد. داده‌های ذخیره‌شده را بررسی کنید."); }
      finally { setLoading(false); }
    };
    load(); window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);
  const tags = useMemo(() => [...new Set(posts.flatMap((post) => post.tags))], [posts]);
  const counts = useMemo(() => {
    const published = posts.filter((post) => post.status === "published").length;
    return { all: posts.length, published, draft: posts.length - published };
  }, [posts]);
  const filtered = useMemo(() => {
    const text = search.trim().toLocaleLowerCase("fa");
    return posts.filter((post) => (status === "all" || post.status === status) && (!tag || post.tags.includes(tag)) &&
      (!text || [post.title, post.author, ...post.tags].some((value) => value.toLocaleLowerCase("fa").includes(text))))
      .sort((a, b) => sort === "title" ? a.title.localeCompare(b.title, "fa") : sort === "oldest" ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt));
  }, [posts, search, status, tag, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return {
    posts, setPosts, loading, error, query, setQuery, status, setStatus, tag, setTag,
    sort, setSort, setPage, tags, counts, filtered, pages, currentPage, visible,
  };
}

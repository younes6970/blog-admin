import { useCallback, useEffect, useMemo, useState } from "react";
import { useBlocker, useNavigate } from "react-router";
import { toast } from "sonner";
import { createPost, type BlogPost, type ContentBlock } from "../types";
import { postRepository } from "../services/postRepository";
import { validatePost } from "../schema";
import type { PostMetadataValue } from "../components/PostMetadata";

export function usePostEditor(id?: string) {
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState<PostMetadataValue | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [initial, setInitial] = useState<BlogPost | null>(null);
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  useEffect(() => {
    try {
      const found = id ? postRepository.list().find((post) => post.id === id) : createPost();
      if (!found) { setError("پست مورد نظر پیدا نشد."); return; }
      const { blocks: content, ...meta } = found;
      setMetadata(meta); setBlocks(content); setInitial(found); setError("");
    } catch { setError("خواندن پست‌ها ممکن نشد. دسترسی مرورگر به حافظه یا داده‌های ذخیره‌شده را بررسی کنید."); }
  }, [id]);
  const post = useMemo<BlogPost | null>(() => metadata ? { ...metadata, blocks } : null, [metadata, blocks]);
  const dirty = !!post && !!initial && (blocks !== initial.blocks || Object.keys(metadata!).some((key) => metadata![key as keyof PostMetadataValue] !== initial[key as keyof PostMetadataValue]));
  const blocker = useBlocker(dirty);
  useEffect(() => {
    if (savedId && !id && !dirty) {
      setSavedId(null);
      void navigate(`/posts/${savedId}/edit`, { replace: true });
    }
  }, [savedId, id, dirty, navigate]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const updateMetadata = useCallback((patch: Partial<PostMetadataValue>) => setMetadata((current) => current ? { ...current, ...patch } : current), []);
  const save = () => {
    if (!post) return;
    const validation = validatePost(post);
    if (validation) { toast.error(validation); return; }
    try {
      const saved = postRepository.save(post);
      const { blocks: content, ...meta } = saved;
      setMetadata(meta); setBlocks(content); setInitial(saved);
      toast.success("پست در این مرورگر ذخیره شد.");
      if (!id) setSavedId(saved.id);
    } catch { toast.error("ذخیره انجام نشد؛ ممکن است حافظه‌ی مرورگر پر یا غیرفعال باشد. می‌توانید JSON را دانلود کنید."); }
  };
  return { post, metadata, blocks, setBlocks, updateMetadata, save, dirty, error, blocker };
}

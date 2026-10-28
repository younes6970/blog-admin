// Run with Node 24: node --test app/modules/blog/blog.test.mjs
import { registerHooks } from "node:module";
import { test } from "node:test";
import assert from "node:assert/strict";

// Node's TypeScript support needs extensions; app imports follow Vite conventions.
registerHooks({ resolve(specifier, context, nextResolve) {
  try { return nextResolve(specifier, context); }
  catch (error) {
    if (specifier.startsWith(".") && context.parentURL?.includes("/app/modules/blog/")) {
      return nextResolve(`${specifier}.ts`, context);
    }
    throw error;
  }
} });
const { createPost, createBlock } = await import("./types.ts");
const { postSchema, validatePost, safeHref, safeImage } = await import("./schema.ts");
const { serializePost } = await import("./utils.ts");
const { postRepository } = await import("./services/postRepository.ts");
const { removeEmptyListItem } = await import("./list-editing.ts");
const { getListMarker } = await import("./block-presentation.ts");

test("all block types retain order and content in the versioned JSON contract", () => {
  const post = createPost();
  post.title = "Sample";
  post.blocks = ["heading", "paragraph", "list", "image", "link"].map(createBlock);
  post.blocks[0].text = "Heading";
  post.blocks[2].items = ["One", "Two"];
  const result = postSchema.parse(JSON.parse(serializePost(post)));
  assert.deepEqual(result, post);
  assert.equal(new Set(post.blocks.map((block) => block.id)).size, 5);
});
test("drafts allow incomplete content while publication requires complete metadata", () => {
  const post = createPost();
  assert.ok(validatePost(post));
  post.title = "Draft";
  assert.equal(validatePost(post), undefined);
  post.status = "published";
  assert.ok(validatePost(post));
  Object.assign(post, { excerpt: "Summary", author: "Author", tags: ["News"], cover: { src: "https://example.com/cover.jpg", alt: "Cover" } });
  post.blocks = [{ ...createBlock("paragraph"), text: "Content" }];
  assert.equal(validatePost(post), undefined);
  post.blocks[0].text = " ";
  assert.ok(validatePost(post));
});
test("unsafe link and image schemes are rejected", () => {
  for (const href of ["javascript:alert(1)", "data:text/html,test", "file:///tmp/test", "//example.com"]) assert.equal(safeHref(href), undefined);
  assert.equal(safeHref("https://example.com/path"), "https://example.com/path");
  assert.equal(safeImage("data:image/svg+xml;base64,AAAA"), undefined);
  assert.ok(safeImage("data:image/png;base64,AAAA"));
});
test("duplicate block IDs cannot enter the storage contract", () => {
  const post = createPost();
  const block = createBlock("paragraph");
  post.blocks = [block, { ...block }];
  assert.equal(postSchema.safeParse(post).success, false);
});
test("repository creates, updates and deletes without duplicate records", () => {
  const storage = new Map();
  globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const post = createPost();
  post.title = "First";
  postRepository.save(post);
  assert.equal(postRepository.list().length, 1);
  postRepository.save({ ...post, title: "Updated" });
  assert.equal(postRepository.list().length, 1);
  assert.equal(postRepository.list()[0].title, "Updated");
  postRepository.remove(post.id);
  assert.deepEqual(postRepository.list(), []);
});
test("corrupt storage is preserved instead of silently overwritten", () => {
  let raw = "invalid json";
  globalThis.localStorage = { getItem: () => raw, setItem: (_key, value) => { raw = value; } };
  assert.throws(() => postRepository.save(createPost()));
  assert.equal(raw, "invalid json");
});
test("storage quota failures propagate so the editor can show a recoverable error", () => {
  globalThis.localStorage = { getItem: () => null, setItem: () => { throw new Error("Quota exceeded"); } };
  assert.throws(() => postRepository.save(createPost()), /Quota exceeded/);
});

test("empty list items delete with either deletion key and focus the previous item", () => {
  for (const key of ["Backspace", "Delete"]) {
    assert.deepEqual(removeEmptyListItem(["First", "", "Third"], 1, key, false), { items: ["First", "Third"], focusIndex: 0 });
    assert.deepEqual(removeEmptyListItem([""], 0, key, false), { items: [], focusIndex: 0 });
    assert.equal(removeEmptyListItem(["Text"], 0, key, false), null);
    assert.equal(removeEmptyListItem([""], 0, key, true), null);
  }
  assert.equal(removeEmptyListItem([""], 0, "ArrowLeft", false), null);
});
test("old posts remain compatible and new marker and banner options survive JSON", () => {
  const post = createPost();
  const list = createBlock("list");
  assert.equal(getListMarker(list), "disc");
  assert.equal(getListMarker({ ...list, ordered: true }), "decimal");
  const banner = createBlock("image");
  assert.ok(postSchema.safeParse({ ...post, blocks: [list, banner] }).success);
  for (const marker of ["decimal", "none", "disc", "circle", "square", "diamond"]) {
    for (const size of ["original", "wide", "slim"]) {
      const updated = { ...post, blocks: [{ ...list, marker, ordered: marker === "decimal" }, { ...banner, size, href: "https://example.com/banner" }] };
      assert.deepEqual(postSchema.parse(JSON.parse(serializePost(updated))), updated);
    }
  }
});

test("all link variants and sizes survive serialization; older links remain valid", () => {
  const post = createPost();
  const oldLink = { id: "legacy-link", type: "link", text: "Read", href: "https://example.com" };
  assert.ok(postSchema.safeParse({ ...post, blocks: [oldLink] }).success);
  for (const variant of ["default", "outline", "ghost"]) {
    for (const size of ["sm", "default", "lg"]) {
      const updated = { ...post, blocks: [{ ...oldLink, variant, size }] };
      assert.deepEqual(postSchema.parse(JSON.parse(serializePost(updated))), updated);
    }
  }
  assert.equal(postSchema.safeParse({ ...post, blocks: [{ ...oldLink, variant: "invalid" }] }).success, false);
});
